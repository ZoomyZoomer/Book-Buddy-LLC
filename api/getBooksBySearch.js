import connectToDatabase from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { search_query, tab_name, username, title, filter } = req.query;

    try {
      // Connect to the database
      await connectToDatabase();

      const shelf = await Bookshelf.findOne({ username });
      if (!shelf) {
        return res.status(404).json({ message: 'Bookshelf not found' });
      }

      // Find the relevant tab
      const tab = shelf.tabs.find((tab) => tab.tab_name === tab_name);
      if (!tab) {
        // If the tab doesn't exist, create it
        shelf.tabs.push({ tab_name: tab_name, books: [] });
        await shelf.save();
      }

      let matchingBooks = [];

      // Filter books by title or author
      if (title === 'title') {
        matchingBooks = tab.books.filter((book) =>
          book.title.toLowerCase().includes(search_query.toLowerCase())
        );
      } else if (title === 'author') {
        matchingBooks = tab.books.filter((book) =>
          book.author.toLowerCase().includes(search_query.toLowerCase())
        );
      } else {
        matchingBooks = tab.books;
      }

      // Handle filtering by 'Completed', 'Reading', 'Last Read', 'Favorites'
      if (filter === 'Completed') {
        let pinnedCompletedBooks = matchingBooks.filter(
          (book) => book.pages_read / book.total_pages === 1 && book.is_pinned
        );
        let nonPinnedCompletedBooks = matchingBooks.filter(
          (book) => book.pages_read / book.total_pages === 1 && !book.is_pinned
        );
        matchingBooks = [...pinnedCompletedBooks, ...nonPinnedCompletedBooks];
      } else if (filter === 'Reading') {
        let pinnedReadingBooks = matchingBooks.filter(
          (book) => book.pages_read / book.total_pages !== 1 && book.is_pinned
        );
        let nonPinnedReadingBooks = matchingBooks.filter(
          (book) => book.pages_read / book.total_pages !== 1 && !book.is_pinned
        );
        matchingBooks = [...pinnedReadingBooks, ...nonPinnedReadingBooks];
      } else if (filter === 'Last Read') {
        let fetchedBooks = tab.last_read.map((book) => book);
        let matchedBooks = fetchedBooks.map(
          (volume_id) =>
            matchingBooks.find((book) => book.volume_id === volume_id) || null
        );
        matchingBooks = matchingBooks.filter(
          (book) => !fetchedBooks.includes(book.volume_id)
        );
        let pinnedBooks = matchedBooks.filter(
          (book) => book && book.is_pinned
        );
        let unpinnedBooks = matchedBooks.filter(
          (book) => book && !book.is_pinned
        );
        matchingBooks = [
          ...pinnedBooks.reverse(),
          ...unpinnedBooks.reverse(),
          ...matchingBooks,
        ];
      } else if (filter === 'Favorites') {
        let favoriteBooks = matchingBooks.filter(
          (book) => book.is_favorite === true
        );
        let pinnedFavoriteBooks = favoriteBooks.filter(
          (book) => book.is_pinned === true
        );
        let nonPinnedFavoriteBooks = favoriteBooks.filter(
          (book) => book.is_pinned !== true
        );
        matchingBooks = [
          ...pinnedFavoriteBooks,
          ...nonPinnedFavoriteBooks,
        ];
      }

      // Add active stickers to each book
      matchingBooks = matchingBooks.map((book) => {
        const stickers = book.active_stickers.map((sticker) => sticker.location);
        return { ...book, active_stickers: stickers };
      });

      // Respond with the modified books
      res.status(200).json(matchingBooks);
    } catch (e) {
      console.error('Error fetching books:', e);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
