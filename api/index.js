const express = require('express');
const User = require('./models/User');
const Quest = require('./models/Quests');
const Bookshelf = require('./models/Bookshelf');
const Inventory = require('./models/Inventory');
const Rating = require('./models/Ratings')
const cors = require('cors');
const stripe = require('stripe')('sk_test_51PqPqkDO7zxNZCMgOY4tK4Rwpmsn3cKHPtCfgHIlUAgIZUCvavOgV1tWKsbdsgqDJJqlSEqNKw2PFU8ykcZwve2E00Og1L2F7Q');
const app = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const OpenAI = require('openai');
const QuestsModel = require('./models/Quests');

app.use(express.json());
app.use(cors({credentials:true, origin:'https://help-five-weld.vercel.app'}));
app.use(cookieParser());

require('dotenv').config();
console.log('Loaded API Key:', process.env.API_KEY);


mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://kcw90:oJQDQrLG9h466RKf@cluster0.ajxucqi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log('mongodb connected');
})
.catch(() => {
    console.log('failed');
})

const salt = bcrypt.genSaltSync(10);
const secret = 'asdjaisd1203810';

const file_items = new Map([
    ['File', '"A mysterious file: Handle with care—could be a game changer or just more paperwork."'],
    ['Certificate', '"A certificate: Proof that you’ve mastered something—at least on paper!"'],
    ['Love Letter', '"A love letter: More powerful than any spell, but handle with care—hearts are fragile!"']
  ]);

const global_tiers = new Map([
    ['I', {value: 20, rarity: 'Common', name: 'file_1', display: 'File', tier: 'I', desc: '"A mysterious file: Handle with care—could be a game changer or just more paperwork."'}],
    ['II', {value: 30, rarity: 'Rare', name: 'file_2', display: 'Certificate', tier: 'II', desc: '"A certificate: Proof that you’ve mastered something—at least on paper!"'}],
    ['III', {value: 50, rarity: 'Epic', name: 'file_3', display: 'Love Letter', tier: 'III', desc: '"A love letter: More powerful than any spell, but handle with care—hearts are fragile!"'}]
]);

const stickerMap = new Map([
    ['0', {sticker_name: 'dapper-bird', sticker_id: '0', location: 0, sticker_display: 'Dapper Bird', sticker_set: {set: 'Christmas', set_item_id: 0, unique_color_name: 'Winter Mint', border_color: '#94F0E7'}}],
    ['1', {sticker_name: 'holly', sticker_id: '1', location: 1, sticker_display: 'Holly', sticker_set: {set: 'Christmas', set_item_id: 1, unique_color_name: 'Winter Mint', border_color: '#94F0E7'}}],
    ['2', {sticker_name: 'eagle', sticker_id: '2', location: 0, sticker_display: 'Eagle', sticker_set: {set: 'Breeze', set_item_id: 0, unique_color_name: 'Chill Green', border_color: 'white'}}],
    ['3', {sticker_name: 'leaves', sticker_id: '3', location: 2, sticker_display: 'Island Leaves', sticker_set: {set: 'Breeze', set_item_id: 1, unique_color_name: 'Chill Green', border_color: 'white'}}],
    ['4', {sticker_name: 'nemo', sticker_id: '4', location: 1, sticker_display: 'Nemo', sticker_set: {set: 'Ocean', set_item_id: 0, unique_color_name: 'Sea Blue', border_color: 'white'}}],
    ['5', {sticker_name: 'crab', sticker_id: '5', location: 0, sticker_display: 'Crab', sticker_set: {set: 'Ocean', set_item_id: 1, unique_color_name: 'Sea Blue', border_color: 'white'}}],
    ['6', {sticker_name: 'spaceship', sticker_id: '6', location: 1, sticker_display: 'Spaceship', sticker_set: {set: 'Space', set_item_id: 0, unique_color_name: 'Space Dark Blue', border_color: 'white'}}],
    ['7', {sticker_name: 'planet', sticker_id: '7', location: 0, sticker_display: 'Planet', sticker_set: {set: 'Space', set_item_id: 1, unique_color_name: 'Space Dark Blue', border_color: 'white'}}],
    ['8', {sticker_name: 'blue-bird', sticker_id: '8', location: 0, sticker_display: 'Blue Bird', sticker_set: {set: 'Nature', set_item_id: 0, unique_color_name: 'Nature Green', border_color: 'white'}}],
    ['9', {sticker_name: 'caterpillar', sticker_id: '9', location: 1, sticker_display: 'Caterpillar', sticker_set: {set: 'Nature', set_item_id: 1, unique_color_name: 'Nature Green', border_color: 'white'}}],
    ['10', {sticker_name: 'pagoda', sticker_id: '10', location: 0, sticker_display: 'Temple', sticker_set: {set: 'Japan', set_item_id: 0, unique_color_name: 'Japan Pink', border_color: 'white'}}],
    ['11', {sticker_name: 'bonsai', sticker_id: '11', location: 1, sticker_display: 'Octo-Bonsai', sticker_set: {set: 'Japan', set_item_id: 1, unique_color_name: 'Japan Pink', border_color: 'white'}}],
])

app.get('/', (req, res) => {
    res.send("success");
});

app.post('/logout', (req, res) => {

    // Clear the 'token' cookie by setting it to null and expiring it immediately
    res.cookie('token', null, { expires: new Date(0), httpOnly: true });
    res.json('Logged out successfully');
    
  })

app.post('/addBook', async (req, res) => {
    
    const {volumeId, title, author, cover, genre, pages, tabName, username} = req.body;

    try{

        const shelf = await Bookshelf.findOne({username: username});
        const tab = shelf.tabs.find(tab => tab.tab_name === tabName);

        const genreExists = shelf.genre_colors.some(gc => gc.genre === genre[0]);

        // Check if the genre exists already

        if (!genreExists){

            const firstColor = shelf.color_collection.shift();

            if (firstColor === undefined){
                shelf.genre_colors.push({genre: genre[0], color: shelf.default_color});
            } else{
                shelf.genre_colors.push({genre: genre[0], color: firstColor});
            }
            
        }
        
        // Check if Something New quest is present (id: 6)
        const quest = await Quest.findOne({username: username});
        const relevant_quest = quest.active_quests.find(quest => quest.id === '6');

        if (relevant_quest){

            if (!relevant_quest.quantity_achieved >= 1){
                relevant_quest.quantity_achieved += 1;
            }

            await quest.save();

        }

        // If the tab doesn't exist, create a new tab
        if (!tab){


            shelf.tabs.push({tab_name: tabName, books: [{volume_id: volumeId, title: title, is_favorite: false, author: author, cover: cover, genre: genre[0], rating: 0, pages_read: 0, total_pages: pages ? pages : 0, banner_items: null, reward_tiers_claimed: [false, false, false, false], icon_set: 'file'}]});
            await shelf.save();

            res.status(201).json({message: "Tab created and book successfully added"});

        } else { // If the tab already exists, append to the book array

            tab.books.push({volume_id: volumeId, title: title, is_favorite: false, author: author, cover: cover, genre: genre[0], rating: 0, pages_read: 0, total_pages: pages ? pages : 0, banner_items: null, reward_tiers_claimed: [false, false, false, false], icon_set: 'file'});
            await shelf.save();

            res.status(201).json({message: "Book successfully added"});

        }

    } catch (e) {
        res.status(500).json({error: e});
    } 

})

app.get('/getCollection', async (req, res) => {

    const { tabName, username } = req.query;


    try {

        const shelf = await Bookshelf.findOne({username: username});
        const tab = shelf.tabs.find(tab => tab.tab_name === tabName);

        // Handle if tab doesn't exist
        if (!tab){
            res.status(200).json([]);
        } else {
            res.status(200).json(tab.books);
        }

    } catch (e){
        res.status(500).json({error: e});
    }

})

app.post('/deleteBook', async (req, res) => {

    const {volume_id, tab_name, username} = req.body;

    try {
        await Bookshelf.updateOne(
          { username: username, 'tabs.tab_name': tab_name },
          { $pull: { 'tabs.$.books': { volume_id: volume_id } } }
        );

        await Bookshelf.updateOne(
            { username: username, "tabs.tab_name": tab_name },
            { $pull: { "tabs.$.last_read": volume_id } }
        );
        
        res.status(200).json({message: "Book successfully deleted"});
      } catch (err) {
        res.status(500).json({message: "Could not delete book"});
      }


})

app.post('/updateRating', async (req, res) => {

    const {tab_name, rating, volume_id, book_name, username} = req.body;
    
    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);

        if (!tab) {
            res.status(500).json({message: "Requested tab not found"});
            return;
        }

        // Find the book within the books array
        const book = tab.books.find(book => book.volume_id === volume_id);

        if (!book) {
            res.status(500).json({message: "Requested book not found"});
            return;
        }

        // Update the rating of the found book
        book.rating = rating;

        // Save the updated bookshelf document
        await shelf.save();

        let volume = await Rating.findOne({ volume_id: volume_id });

        if (!volume){

            volume = new Rating({
                book_name: book_name,
                volume_id: volume_id,
                ratings: [{username: username, rating_value: rating, date: new Date()}]
            });
          
            await volume.save();

            res.status(201).json({message: 'New volume entry successfully created'});
            return;
            
        }

        const user = volume.ratings.find(user => user.username === username);

        if (!user){
            volume.ratings.push({username: username, rating_value: rating, date: new Date()});
            await volume.save();
            res.status(201).json({message: 'New user rating entry successfully created'});
            return;
        }

        user.rating_value = rating;
        user.date = new Date();

        await volume.save();

        res.status(201).json({message: "Rating successfully updated"});
        return;

    } catch (e) {
        res.status(500).json({error: e});
    }
})

app.get('/getRating', async (req, res) => {

    const {tab_name, volume_id, username} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);

        if (!tab) {
            res.status(500).json({message: "Requested tab not found"});
        }

        // Find the book within the books array
        const book = tab.books.find(book => book.volume_id === volume_id);

        if (!book) {
            res.status(500).json({message: "Requested book not found"});
        }

        const rating_res = book.rating;

        res.status(200).json(rating_res);

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.get('/fetch-ratings', async(req, res) => {

    const {volume_id} = req.query;

    try {

        const volume = await Rating.findOne({ volume_id: volume_id });
        let ratingsArray = new Array(6).fill(0);

        volume.ratings.forEach(rating => {
            ratingsArray[rating.rating_value]++;
            ratingsArray[0]++;
        })

        res.status(200).json(ratingsArray);

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.get('/getPages', async (req, res) => {

    const {volume_id, tab_name, username} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);

        if (!tab) {
            res.status(500).json({message: "Requested tab not found"});
        }

        const book = tab.books.find(book => book.volume_id === volume_id);

        if (!book) {
            res.status(500).json({message: "Requested book not found"});
        }

        res.status(200).json([book.pages_read, book.total_pages]);

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post('/setPages', async (req, res) => {

    const {volume_id, tab_name, pages_read, username} = req.body;

    try {
        const shelf = await Bookshelf.findOne({ username: username });
        if (!shelf) {
            return res.status(404).json({ message: "Shelf not found" });
        }
    
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
    
        if (!tab) {
            return res.status(500).json({ message: "Requested tab not found" });
        }
    
        const book = tab.books.find(book => book.volume_id === volume_id);
    
        if (!book) {
            return res.status(500).json({ message: "Requested book not found" });
        }
    
        book.pages_read = pages_read;
    
        await shelf.save();
    
        res.status(201).json({ message: "Page count successfully updated" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

})

app.get('/getBooksBySearch', async(req, res) => {

    const {search_query, tab_name, username, title, filter} = req.query;

    try {
        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);

        if (!tab){
            // Create a new tab if it doesn't exist
            shelf.tabs.push({tab_name: tab_name, books: []});
            await shelf.save();
        }

        let matchingBooks = [];

        if (title === 'title'){
            matchingBooks = tab.books.filter(book => book.title.toLowerCase().includes(search_query.toLowerCase()));
        } else if (title === 'author') {
            matchingBooks = tab.books.filter(book => book.author.toLowerCase().includes(search_query.toLowerCase()));
        } else {
            matchingBooks = tab.books;
        }


        if (filter === 'Completed'){
            // Separate pinned completed books from non-pinned completed books
            let pinnedCompletedBooks = matchingBooks.filter(book => (book.pages_read / book.total_pages) === 1 && book.is_pinned);
            let nonPinnedCompletedBooks = matchingBooks.filter(book => (book.pages_read / book.total_pages) === 1 && !book.is_pinned);

            // Concatenate pinned completed books first, followed by non-pinned completed books
            matchingBooks = [
                ...pinnedCompletedBooks, 
                ...nonPinnedCompletedBooks
            ];
        } else if (filter === 'Reading'){
            // Separate pinned reading books from non-pinned reading books
            let pinnedReadingBooks = matchingBooks.filter(book => (book.pages_read / book.total_pages) !== 1 && book.is_pinned);
            let nonPinnedReadingBooks = matchingBooks.filter(book => (book.pages_read / book.total_pages) !== 1 && !book.is_pinned);

            // Concatenate pinned reading books first, followed by non-pinned reading books
            matchingBooks = [
                ...pinnedReadingBooks, 
                ...nonPinnedReadingBooks
            ];
        } else if (filter === 'Last Read'){
            let fetchedBooks = tab.last_read.map(book => book);
            
            // Get matched books based on the 'last_read' list
            let matchedBooks = fetchedBooks.map(volume_id => 
                matchingBooks.find(book => book.volume_id === volume_id) || null
            );
            
            // Filter out books that have already been matched
            matchingBooks = matchingBooks.filter(book => 
                !fetchedBooks.includes(book.volume_id)
            );
        
            // Separate pinned books from matched and remaining books
            let pinnedBooks = matchedBooks.filter(book => book && book.is_pinned);
            let unpinnedBooks = matchedBooks.filter(book => book && !book.is_pinned);
        
            // Concatenate: pinned books first, then unpinned last read books, then the remaining books
            matchingBooks = [...pinnedBooks.reverse(), ...unpinnedBooks.reverse(), ...matchingBooks];
        } else if (filter === 'Favorites'){
             // Filter books that are marked as favorites
            let favoriteBooks = matchingBooks.filter(book => book.is_favorite === true);
            
            // Separate pinned favorite books from non-pinned favorite books
            let pinnedFavoriteBooks = favoriteBooks.filter(book => book.is_pinned === true);
            let nonPinnedFavoriteBooks = favoriteBooks.filter(book => book.is_pinned !== true);
            
            // Concatenate pinned favorite books first, followed by non-pinned favorite books
            matchingBooks = [
                ...pinnedFavoriteBooks,    // Pinned favorite books first
                ...nonPinnedFavoriteBooks  // Then non-pinned favorite books
            ];
        }

        res.status(200).json(matchingBooks);
        

      } catch (e) {
        res.status(500).json({error: e});
      }

})

app.get('/getGenreColor', async(req, res) => {

    const {username, genre} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });

        const genreObject = shelf.genre_colors.find(gc => gc.genre === genre);

        if (genreObject === undefined){
            genreObject = {color: shelf.default_color};
        }

        return res.status(200).json({ color: genreObject.color });
    
    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.get('/getBanners', async(req, res) => {

    const {username, tab_name, volume_id} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        res.status(200).json(book.banner_items);

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post('/openai-request', async(req, res) => {

    const { question, title } = req.body;

  
    try {

        const openai = new OpenAI();

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: `You are an expert on the book ${title} and talk in a semi-casual way` },
                { role: "user", content: question }
            ],
            model: "gpt-3.5-turbo",
          });

       res.status(200).json(completion.choices[0].message.content);
    
    } catch (error) {
      res.status(500).json({ error: error.response ? error.response.data : error.message });
    }

  });

app.post('/openai-quote', async(req, res) => {

    const { question, title } = req.body;

  
    try {

        const openai = new OpenAI();

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: `You only respond with a quote from the book '${title}' and then a dash, followed by who said the quote. If you can not quote the book, do not respond.` },
                { role: "user", content: question }
            ],
            model: "gpt-4o-mini",
          });

       res.status(200).json(completion.choices[0].message.content);
    
    } catch (error) {
      res.status(500).json({ error: error.response ? error.response.data : error.message });
    }

})

app.get('/fetch-tiers', async(req,res) => {

    const {username, tab_name, volume_id} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        res.status(200).json(book.reward_tiers_claimed);

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post('/process-claim', async(req,res) => {

    const {username, tab_name, volume_id, tier} = req.body;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        book.reward_tiers_claimed[tier - 1] = true;

        await shelf.save();

        res.status(201).json({message: "Tier successfully updated"});

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post("/send-entry", async(req,res) => {

    const {username, tab_name, volume_id, pages_added, total_pages_read, title} = req.body;

    try{

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        if (pages_added <= 0){
            res.status(500).json({message: 'Invalid number of pages'});
            return;
        }

        if (tab.last_read.length > 0){
            const index = tab.last_read.indexOf(book.volume_id);
            if (index !== -1) {
                // Remove the entry with the corresponding volume_id
                tab.last_read.splice(index, 1);
            }
            tab.last_read.push(book.volume_id);
        } else {
            tab.last_read.push(book.volume_id);
        }

        // Check if page read quest is present (id: 1)
        const quest = await Quest.findOne({ username: username });
        const relevant_quest = quest.active_quests.find(quest => quest.id === '0');

        if (relevant_quest){

            if (relevant_quest.quantity_achieved + pages_added > 50){
                relevant_quest.quantity_achieved = 50;
            } else {
                relevant_quest.quantity_achieved += pages_added;
            }

            await quest.save();

        }

        book.pages_read = total_pages_read;

        const inventory = await Inventory.findOne({username: username});
        const item_set = inventory.items.find(set => set.item_set_id === book.icon_set);

        const now = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const month = monthNames[now.getMonth()];
        const day = String(now.getDate()).padStart(2, '0');
        const year = now.getFullYear();

        // Check if the date of the prev Entry is the same as the one we're trying to add...
        // If so, combine total pages read into a single entry (Each entry should represent one day)

        if(book.page_entries.length > 0){

            const entry = book.page_entries[book.page_entries.length - 1];

            if ((entry.date.month == month) && (entry.date.day == day) && (entry.date.year == year)){

                entry.pages_added += pages_added;
                entry.new_page_total += pages_added;

                // Check total_entries for the same
                const relatedEntry = shelf.total_entries.find(book => (book.date.month == month) && (book.date.day == day) && (book.date.year == year) && book.volume_id == volume_id);
                relatedEntry.pages_added += pages_added;
                relatedEntry.new_page_total += pages_added;

                await shelf.save();
                res.status(201).json({message: "Entry successfully combined and recorded"});

                return;

            }

        }

        let icon = `${book.icon_set}_1`;
        let rarity = 'Common';
        let value = 10;
        let streak = 0;
        let display = shelf.settings.entry_default_icon;
        let tier = 'I';
        let desc = '"A mysterious file: Handle with care—could be a game changer or just more paperwork."';
        let max = 5;

        if (book.page_entries.length > 0){
            if (book.page_entries[book.page_entries.length - 1].icon.name == `${book.icon_set}_1`){
                icon = `${book.icon_set}_2`;
                rarity = 'Rare';
                value = 20;
                display = 'Certificate';
                tier = 'II';
                desc = file_items['Certificate'];
            } else if (book.page_entries[book.page_entries.length - 1].icon.name == (`${book.icon_set}_2`)){
                icon = `${book.icon_set}_3`;
                rarity = 'Epic'
                value = 40;
                display = "Love Letter";
                tier = 'III';
                desc = file_items['Love Letter'];
            } else if (book.page_entries[book.page_entries.length - 1].icon.name == (`${book.icon_set}_3`)){
                icon = `${book.icon_set}_3`;
                rarity = 'Epic'
                value = 40;
                display = "Love Letter";
                tier = 'III';
                desc = file_items['Love Letter'];
            }
        }
        
        const item = item_set.item_set.find(set => set.item === display); 

        item.quantity += 1;

        await inventory.save();

        let prevDates = [];

        if (book.page_entries.length > 0){
            streak = book.page_entries[book.page_entries.length - 1].streak.days + 1;
            prevDates = book.page_entries[book.page_entries.length - 1].streak.dates;
        }

        if (!shelf.streak_today){
            shelf.streak_today = true;
        }
        
        book.page_entries.push({volume_id: volume_id, title: title, pages_added: Number(pages_added), new_page_total: Number(total_pages_read), date: {month: month, day: day, year: year}, icon: {name: icon, display: display, tier: tier, rarity: rarity, value: value, desc: desc}, streak: {days: streak, dates: [`${month} ${day}`, ...prevDates]}});
        shelf.total_entries.push({volume_id: volume_id, title: title, pages_added: Number(pages_added), new_page_total: Number(total_pages_read), date: {month: month, day: day, year: year}, icon: {name: icon, display: display, tier: tier, rarity: rarity, value: value, desc: desc}, streak: {days: streak, dates: [`${month} ${day}`, ...prevDates]}});

        await shelf.save();

        res.status(201).json({message: "Entry successfully recorded"});

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.get('/get-entry', async(req,res) => {

    const {username, tab_name, volume_id, index} = req.query;

    try{

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        const inventory = await Inventory.findOne({username: username});
        const item_set = inventory.items.find(set => set.item_set_id === book.icon_set);
        

        const entriesLength = book.page_entries.length;

        if (entriesLength === 0){
            res.status(200).json({message: "No entries found"});
            return;
        }

        const newIndex = entriesLength - 1 - index;
        const item = item_set.item_set.find(set => set.item === book.page_entries[newIndex].icon.display);

        const pagesFrom0 = book.page_entries[newIndex].new_page_total - book.page_entries[newIndex].pages_added;
        const pagesTo0 = book.page_entries[newIndex].new_page_total;
        const date0 = book.page_entries[newIndex].date.month + " " + book.page_entries[newIndex].date.day + ", " + book.page_entries[newIndex].date.year;
        const percent0 = Math.floor(((pagesTo0 - pagesFrom0) / book.total_pages) * 100);


        res.status(200).json([{pagesRead: pagesTo0 - pagesFrom0, date: date0, percent: percent0, item: book.page_entries[newIndex].icon.display, image: book.page_entries[newIndex].icon.name, rarity: book.page_entries[newIndex].icon.rarity, tier: book.page_entries[newIndex].icon.tier, value: book.page_entries[newIndex].icon.value, desc: book.page_entries[newIndex].icon.desc, quantity: item.quantity, max: item.max}]);


    } catch(e){
        res.status(500).json({error: e});
    }

})

app.get('/fetch-settings', async (req, res) => {
    
    const { username } = req.query;
  
    try {
      const shelf = await Bookshelf.findOne({ username: username });
  
      if (!shelf) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(shelf.settings);
      
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

app.post('/bookBot-intro', async(req, res) => {

    const {username} = req.body;

    try {

        const shelf = await Bookshelf.findOne({ username: username });

        shelf.settings.bookBot_intro = false;

        await shelf.save();

        res.status(200).json({message: "bookBot_intro updated"});
        
    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.get('/fetch-entries-array', async (req, res) => {
    const { username, tab_name, volume_id, index, numEntries } = req.query;

    try {
        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        const totalEntries = book.page_entries.length;
        const startIndex = index ? Math.max(totalEntries - parseInt(index), 0) : Math.max(totalEntries - numEntries, 0);
        const endIndex = Math.max(startIndex - numEntries, 0);
        const pageEntries = book.page_entries.slice(endIndex, startIndex).reverse();

        while (pageEntries.length < numEntries) {
            pageEntries.push(null);
        }

        res.status(200).json(pageEntries);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


app.get('/fetch-entries-array-length', async(req, res) => {

    const {username, tab_name, volume_id} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        const totalEntries = book.page_entries.length;

        res.status(200).json(totalEntries);

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.get('/fetch-icon-set', async(req, res) => {

    const {username, tab_name, volume_id} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        res.status(200).json({message: 'ok'});

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post('/remove-entry', async(req, res) => {

    const {username, tab_name, volume_id, index} = req.body;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        const realIndex = book.page_entries.length - 1 - index;

        const pagesToRemove = book.page_entries[realIndex].pages_added;

        book.pages_read -= pagesToRemove;
        book.page_entries.splice(realIndex, 1);

        await shelf.save();
        
        res.status(200).json({message: "Entry successfully deleted"});

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post('/update-entry', async(req, res) => {

    const {username, tab_name, volume_id, index} = req.body;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        const inventory = await Inventory.findOne({username: username});
        const item_set = inventory.items.find(set => set.item_set_id === book.icon_set);

        const realIndex = book.page_entries.length - 1 - index;

        const item = book.page_entries[realIndex].icon;

        const refinedVals = global_tiers.get(`${item.tier}I`);

        const item2 = item_set.item_set.find(set => set.item === refinedVals.display); 

        book.page_entries[realIndex].icon = refinedVals;

        await shelf.save();

        res.status(200).json({item: refinedVals.display, tier: refinedVals.tier, value: refinedVals.value, quantity: item2.quantity, rarity: refinedVals.rarity, name: refinedVals.name, desc: refinedVals.desc});

    } catch(e) {
        res.status(500).json({error: e});
    }

})

const items = [
    [
        {name: 'File', value: 10, rarity: 'Common', display: 'file_1', desc: `"A mysterious file: Handle with care—could be a game changer or just more paperwork."`}, 
        {name: 'Stat Sheet', value: 12, rarity: 'Common', display: 'file_4', desc: `"Discover your milestones and metrics, neatly organized for your perusal."`}
    ],

    [
        {name: 'Certificate', value: 28, rarity: 'Rare', display: 'file_2', desc: `"Proof that you’ve mastered something—at least on paper!"`},
        {name: 'Love Letter', value: 32, rarity: 'Rare', display: 'file_3', desc: `"More powerful than any spell, but handle with care—hearts are fragile!"`}
    ],

    [
        {name: 'Diploma', value: 58, rarity: 'Epic', display: 'file_5', desc: `"A rare testament to your dedication and achievement, a symbol of hard-earned knowledge and success."`}
    ]]

    const fileMap = new Map([
        ['0', {name: 'Spreadsheet', id: '0', value: 10, rarity: 'Common', display: 'file_1', desc: `"A mysterious file: Handle with care—could be a game changer or just more paperwork."`}],
        ['1', {name: 'Stat Sheet', id: '1', value: 12, rarity: 'Common', display: 'file_4', desc: `"Discover your milestones and metrics, neatly organized for your perusal."`}],
        ['20', {name: 'Certificate', id: '20', value: 28, rarity: 'Rare', display: 'file_2', desc: `"Proof that you’ve mastered something—at least on paper!"`}],
        ['21', {name: 'Love Letter', id: '21', value: 32, rarity: 'Rare', display: 'file_3', desc: `"More powerful than any spell, but handle with care—hearts are fragile!"`}],
        ['40', {name: 'Diploma', id: '40', value: 58, rarity: 'Epic', display: 'file_5', desc: `"A rare testament to your dedication and achievement, a symbol of hard-earned knowledge and success."`}]
    ])


app.post('/set-tier-info', async(req, res) => {

    const {username, tab_name, volume_id, tier, info} = req.body;

    try {
    
        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        const now = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const month = monthNames[now.getMonth()];
        const day = String(now.getDate()).padStart(2, '0');
        const year = now.getFullYear();

        book.reward_tiers_loot.push({tier: tier, date: `${month} ${day}, ${year}`,name: info.name, display: info.display, coins: info.coins, xp: info.xp, loot: info.loot})

        shelf.save();

        res.status(200).json({message: 'Item(s) successfully logged'});

    } catch(e) {
        res.status(500).json({error: e});
    }
    
})

app.get('/get-tier-info', async(req, res) => {

    const {username, tab_name, volume_id} = req.query;

    try {

        let infoArray = [];

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        for (let i = 1; i <= 4; i++){
            infoArray.push(book.reward_tiers_loot.find(tiers => tiers.tier === i));
        }

        res.status(200).json(infoArray);

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.get('/get-stickers', async(req, res) => {

    const {username} = req.query;

    try {

    const inventory = await Inventory.findOne({ username: username });

    res.status(200).json([inventory.stickers[0].Top_cover, inventory.stickers[0].Bottom_cover]);

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post('/send-stickers', async(req, res) => {
    const {username, volume_id, tab_name, top_sticker, bottom_sticker, border} = req.body;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);
        const inventory = await Inventory.findOne({ username: username });

        if (book?.stickers?.top_cover !== undefined && book?.stickers?.top_cover !== top_sticker?.sticker_id){
            const topStick = inventory.stickers[0].Top_cover.find(sticker => sticker.sticker_id === book.stickers.top_cover);
            topStick.quantity += 1;
        }

        if (book?.stickers?.bottom_cover !== undefined && book?.stickers?.bottom_cover !== bottom_sticker?.sticker_id){
            const bottomStick = inventory.stickers[0].Bottom_cover.find(sticker => sticker.sticker_id === book.stickers.bottom_cover);
            bottomStick.quantity += 1;
        }

        book.stickers.top_cover = top_sticker?.sticker_id;
        book.stickers.bottom_cover = bottom_sticker?.sticker_id;
        book.stickers.border = border;

        await shelf.save();

        if (top_sticker?.sticker_id !== undefined){
            const top = inventory.stickers[0].Top_cover.find(sticker => sticker.sticker_id === top_sticker?.sticker_id);
            top.quantity -= 1;
        }

        if (bottom_sticker?.sticker_id !== undefined){
            const bot = inventory.stickers[0].Bottom_cover.find(sticker => sticker.sticker_id === bottom_sticker?.sticker_id);
            bot.quantity -= 1;
        }

        // Check if That's Adhesive quest is present (id: 7)
        const quest = await Quest.findOne({username: username});
        const relevant_quest = quest.active_quests.find(quest => quest.id === '7');

        if (relevant_quest){

            if (!relevant_quest.quantity_achieved >= 1){
                relevant_quest.quantity_achieved += 1;
            }

            await quest.save();

        }

        await inventory.save();

        res.status(200).json({message: 'Stickers successfully updated'});

    } catch(e){
        res.status(500).json({error: e});
    }

})

app.get('/get-active-stickers', async(req, res) => {

    const {username, volume_id, tab_name} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        const top_id = book?.stickers?.top_cover;
        const bot_id = book?.stickers?.bottom_cover;

        let topMap = stickerMap.get(top_id);
        let botMap = stickerMap.get(bot_id);


        res.status(200).json([topMap, botMap, book?.stickers?.border]);
        
    } catch(e){
        res.status(500).json({error: e});
    }

})

app.post('/set-favorite', async(req, res) => {

    const {username, volume_id, tab_name} = req.body;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        book.is_favorite = !book.is_favorite;

        await shelf.save();

        res.status(200).json({message: 'Book added to favorites'});

    } catch(e){
        res.status(500).json({error: e});
    }

})

app.get('/fetch-favorites', async(req, res) => {

    const {username, volume_id, tab_name} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        res.status(200).json(book.is_favorite);

    } catch(e){
        res.status(500).json({error: e});
    }

})

app.get('/fetch-library-data', async(req, res) => {

    const {username, tab_name} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);

        const result = [];
        const dateFormat = { month: 'long' };

        // Get the current date
        const date = new Date(); 

        // Define month names
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Extract month and day
        const month = monthNames[date.getMonth()]; // Get month name
        const day = date.getDate(); // Get day of the month

        // Function to format day with leading zero
        const formatDay = (day) => day < 10 ? `0${day}` : day;

        const formatDate = (date) => {
            const month = monthNames[date.getMonth()];
            const day = formatDay(date.getDate());
            return `${month} ${day}`;
        };

        // Parse the current date
        let currentDate = new Date();

        // Loop through the current day and the previous 6 days
        for (let i = 0; i < 7; i++) {
            // Format the date to 'Month Day' format
            const formattedDate = formatDate(currentDate);
            
            // Push the formatted date string to the result array
            result.push(formattedDate);
            
            // Subtract one day from the current date
            currentDate.setDate(currentDate.getDate() - 1);
        }

        const dateEntries = result.map(date => ({ date, pages: [] }));

        tab.books.forEach(book => {
            book.page_entries.forEach(entry => {
              const dayIndex = result.indexOf(entry.date.month + " " + entry.date.day);
              if (dayIndex !== -1) {
                dateEntries[dayIndex].pages.push(entry.pages_added);
              }
            });
          });

        let res1 = [];
        let res2 = [];
        let index = 0;

        dateEntries.forEach( entry => {
            res1.push(entry.date);
            entry.pages.forEach( val => {
                if (res2[index] === undefined) {
                    res2[index] = 0;
                  }
                res2[index] += val;
            })
            index++;
        })

        res.status(200).json([res1.reverse(), res2.reverse()]);

    } catch(e){
        res.status(500).json({error: e});
    }

})

app.get('/getCount', async(req, res) => {

    const {username, tab_name} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);

        const res1 = tab.books.filter(book => book.pages_read / book.total_pages === 1);
        const res2 = tab.books.filter(book => book.pages_read / book.total_pages !== 1);
        const res3 = tab.books.filter(book => book.is_favorite);

        // Update I Love Everything achievement (id: 3)
        const quest = await Quest.findOne({ username: username});
        const achievement = quest.active_achievements.find(ach => ach.id === '3');

        // Already an active achievement (in progress)
        if (achievement) {
            achievement.quantity = res3.length;
        } else {
            quest.active_achievements.push({id: '3', quantity: res3.length});
        }

        // Update An Open Book achievement (id: 10)
        const achievement2 = quest.active_achievements.find(ach => ach.id === '10');

        // Already an active achievement (in progress)
        if (achievement2) {
            achievement2.quantity = res1.length;
        } else {
            quest.active_achievements.push({id: '10', quantity: res1.length});
        }

        // Update Hold My Bookmark achievement (id: 12)
        const achievement3 = quest.active_achievements.find(ach => ach.id === '12');

        // Already an active achievement (in progress)
        if (achievement3) {
            achievement3.quantity = res1.length;
        } else {
            quest.active_achievements.push({id: '12', quantity: res1.length});
        }

        await quest.save()

        res.status(200).json([res1.length, res2.length, res3.length]);

    } catch(e){
        res.status(500).json({error: e});
    }

})

app.get('/pageInfo', async(req, res) => {

    const {username, tab_name} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);

        let pagesRead = 0;
        let totalPages = 0;

        tab.books.forEach(book => {
            pagesRead += book.pages_read;
            totalPages += book.total_pages;
        })

        res.status(200).json([pagesRead, totalPages]);

    } catch(e){
        res.status(500).json({error: e});
    }

})

app.post('/editTab', async(req, res) => {

    const {username, tab_name, desired_name} = req.body;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);

        tab.tab_name = desired_name;

        await shelf.save();

        res.status(200).json({message: 'Tab name updated'});

    } catch(e){
        res.status(500).json({error: e});
    }

})

app.get('/fetchTabs', async(req, res) => {

    const {username} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        let tabList = [];

        shelf.tabs.forEach(tab => {
            tabList.push(tab.tab_name)
        })

        res.status(200).json(tabList);

    } catch(e){
        res.status(500).json({error: e});
    }

})

const questMap = new Map([
    ['0', {id: '0', title: 'A New Day', quest: 'Read 50 pages', quantity_required: 50}],
    ['1', {id: '1', title: 'More Dust', quest: 'Place a file in your warehouse', quantity_required: 1}],
    ['2', {id: '2', title: 'Level Up', quest: 'Collect 25 experience points', quantity_required: 25}],
    ['3', {id: '3', title: 'Morning Coffee', quest: 'Drink a cold brew', quantity_required: 1}],
    ['4', {id: '4', title: 'Merchant', quest: 'Buy something from the Market', quantity_required: 1}],
    ['5', {id: '5', title: 'Good Morning', quest: 'Log In', quantity_required: 1}],
    ['6', {id: '6', title: 'Something New', quest: 'Add a book to your library', quantity_required: 1}],
    ['7', {id: '7', title: "That's Adhesive", quest: 'Apply a sticker to a book', quantity_required: 1}],
    ['8', {id: '8', title: 'Satisfying', quest: 'Pickup a ready file in your warehouse', quantity_required: 1}],
    ['9', {id: '9', title: 'Pretty Penny', quest: 'Profit 25 coins today', quantity_required: 25}]
])

app.get('/fetch-quests', async(req, res) => {

    const {username} = req.query;

    try {

        const quest = await Quest.findOne({ username: username });
        const inventory = await Inventory.findOne({ username: username });


        // Decide whether to fetch active quests or get new ones if it's a new day
        const now = new Date();
        let newQuests = [];

        // New day has started
        if (now >= quest.daily_quest_time){

            for (let i = 0; i < 3; i++){

                let randomQuest = questMap.get((Math.floor(Math.random() * questMap.size)).toString());

                
                if (!newQuests.includes(randomQuest)){
                    newQuests.push(randomQuest);
                } else {
                    i--;
                }
                
            }

            // Check if all quests from the previous were completed
            if (quest.active_quests.length !== 0){
                if (!quest.active_quests[0].marked_complete || !quest.active_quests[1].marked_complete || !quest.active_quests[2].marked_complete) {
                    quest.streak = 0;
                }
            }

            quest.active_quests = [
                {id: newQuests[0].id, held_xp: inventory.currency.xp, held_coins: inventory.currency.coins},
                {id: newQuests[1].id, held_xp: inventory.currency.xp, held_coins: inventory.currency.coins},
                {id: newQuests[2].id, held_xp: inventory.currency.xp, held_coins: inventory.currency.coins}
            ]

            // Update Daily Cup of Joe achievement (id: 2)
            const achievement = quest.active_achievements.find(ach => ach.id === '2');

            // Already an active achievement (in progress)
            if (achievement) {
                achievement.quantity += 1;
            } else {
                quest.active_achievements.push({id: '2', quantity: 1});
            }

            await quest.save();

            // Check if Good Morning quest is present (id: 5)
            const relevant_quest = quest.active_quests.find(quest => quest.id === '5');

            if (relevant_quest){

                if (!relevant_quest.quantity_achieved >= 1){
                    relevant_quest.quantity_achieved += 1;
                }

                await quest.save();

            }

            // Update time

                const midnightTomorrow = new Date(now);

                midnightTomorrow.setDate(now.getDate() + 1);
                midnightTomorrow.setHours(0, 0, 0, 0);

                quest.daily_quest_time = midnightTomorrow;


            await quest.save();

            res.status(200).json([newQuests, quest.active_quests, quest.streak, midnightTomorrow]);
            return;

        } else {

            quest.active_quests.forEach(quest => quest.id === '2' ? inventory.currency.xp - quest.held_xp > 25 ? quest.quantity_achieved = 25 : quest.quantity_achieved = inventory.currency.xp - quest.held_xp : undefined);
            quest.active_quests.forEach(quest => quest.id === '9' ? inventory.currency.coins - quest.held_coins > 25 ? quest.quantity_achieved = 25 : (quest.quantity_achieved < 25 ? quest.quantity_achieved = inventory.currency.xp - quest.held_xp : undefined): undefined);

            await quest.save();

            quest.active_quests.forEach(quest => newQuests.push(questMap.get(quest.id)));

            res.status(200).json([newQuests, quest.active_quests, quest.streak, quest.daily_quest_time]);
            return;

        }

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post('/update-streak', async(req, res) => {

    const {username} = req.body;

    try {

        const quest = await Quest.findOne({ username: username });

        // Update I'm Unstoppable! achievement (id: 8)
        const achievement = quest.active_achievements.find(ach => ach.id === '8');

        if (quest.active_quests[0].marked_complete && quest.active_quests[1].marked_complete && quest.active_quests[2].marked_complete){

            if (achievement.quantity < 3){

                if (achievement) {
                    achievement.quantity = quest.streak;
                } else {
                    quest.active_achievements.push({id: '8', quantity: quest.streak});
                }

                await quest.save();

            }

            res.status(200).json(quest.streak);
            return;
        } else {

            quest.active_quests.forEach(quest => quest.marked_complete = true);

            if (achievement.quantity < 3){

                // Already an active achievement (in progress)
                if (achievement) {
                    achievement.quantity = quest.streak + 1;
                } else {
                    quest.active_achievements.push({id: '7', quantity: quest.streak + 1});
                }

                if (quest.streak < 3){
                    quest.streak += 1;
                } else {
                    quest.streak = 1;
                }

            }

            await quest.save();

            res.status(200).json(quest.streak);

        }


    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post('/mark-claimed', async(req, res) => {

    const {username, index} = req.body;

    try {

        const quest = await Quest.findOne({ username: username });

        quest.active_quests[index].claimed = true;

        await quest.save();

        res.status(200).json({message: 'Reward claimed'});

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post('/update-streak-reward', async(req, res) => {

    const {username} = req.body;

    try {

        const quest = await Quest.findOne({ username: username });

        quest.streak = 0;

        await quest.save();

        res.status(200).json({message: 'Streak reward claimed'});

    } catch(e) {
        res.status(500).json({error: e});
    }

})

const achievementMap = new Map([
    ['0', {id: '0', achievement_name: 'My Name is..', difficulty: 'Easy', icon: 'id-card', description: 'Register an account on BookBuddy', quantity: 1, reward: {file: 'file_5', file_id: '40'}}],
    ['1', {id: '1', achievement_name: 'File Farmer', difficulty: 'Easy', icon: 'sack', description: 'Collect 10 freshly dusted files', quantity: 10, reward: {file: 'file_4', file_id: '1'}}],
    ['2', {id: '2', achievement_name: 'Daily Cup of Joe', difficulty: 'Easy', icon: 'coffee_cup', description: 'Log in daily 3 times', quantity: 3 , reward: {item: 'coffee_cup', item_id: '0'}}],
    ['3', {id: '3', achievement_name: 'I Love Everything!', difficulty: 'Easy', icon: 'heart', description: 'Favorite atleast 5 books', quantity: 5, reward: {file: 'file_1', file_id: '0'}}],
    ['4', {id: '4', achievement_name: "Box o'Love", difficulty: 'Easy', icon: 'love_box', description: 'Open up 10 boxes / gifts', quantity: 10, reward: {item: 'package_icon', item_id: '11'}}],
    ['5', {id: '5', achievement_name: 'Message in a Bottle', difficulty: 'Easy', icon: 'miab', description: 'Send a feedback response', quantity: 1, reward: {item: 'coffee_cup', item_id: '0'}}],
    ['6', {id: '6', achievement_name: 'Lucky Penny', difficulty: 'Easy', icon: 'coin_penny', description: 'Purchase 5 items from the market', quantity: 5, reward: {item: 'coupon', item_id: '1'}}],
    ['7', {id: '7', achievement_name: 'A Little Taste', difficulty: 'Medium', icon: 'lollipop', description: 'Collect 4 different stickers', quantity: 4, reward: {file: 'file_3', file_id: '21'}}],
    ['8', {id: '8', achievement_name: "I'm Unstoppable!", difficulty: 'Medium', icon: 'calendar', description: 'Get a quest streak for 3 days', quantity: 3, reward: {file: 'file_2', file_id: '20'}}],
    ['9', {id: '9', achievement_name: 'King of the Corners', difficulty: 'Medium', icon: 'flag', description: 'Uncover all 4 corners of the warehouse', quantity: 4, reward: {file: 'file_3', file_id: '21'}}],
    ['10', {id: '10', achievement_name: 'An Open Book', difficulty: 'Medium', icon: 'open_book', description: 'Finish reading 6 books', quantity: 6, reward: {item: 'package_icon', item_id: '11'}}],
    ['11', {id: '11', achievement_name: 'The Big Bucks', difficulty: 'Medium', icon: 'big_bucks', description: 'Purchase 15 items from the market', quantity: 15, reward: {item: 'coupon', item_id: '1'}}],
    ['12', {id: '12', achievement_name: 'Hold My Bookmark', difficulty: 'Hard', icon: 'book_stack', description: 'Finish reading 14 books', quantity: 14, reward: {file: 'file_5', file_id: '40'}}],
    ['13', {id: '13', achievement_name: 'A Piece of Cake.. Literally', difficulty: 'Hard', icon: 'cake', description: 'Collect 8 different stickers', quantity: 8, reward: {file: 'file_5', file_id: '40'}}],
    ['14', {id: '14', achievement_name: 'I See it All!', difficulty: 'Hard', icon: 'map', description: 'Explore the entire warehouse', quantity: 1, reward: {file: 'file_5', file_id: '40'}}],
    ['15', {id: '15', achievement_name: 'Put it on My Card', difficulty: 'Hard', icon: 'wallet', description: 'Have 1000+ coins in your inventory', quantity: 1000, reward: {file: 'file_5', file_id: '40'}}],
    ['16', {id: '16', achievement_name: 'The Whole Pie!.. Cake', difficulty: 'Very Hard', icon: 'full-cake', description: 'Collect all 12 different stickers', quantity: 12, reward: {file: 'file_5', file_id: '40'}}]
])

app.get('/fetch-achievements', async(req, res) => {

    const {username} = req.query;

    try {

        const quest = await Quest.findOne({ username: username });
        const inventory = await Inventory.findOne({username: username});

        // Update A Little Taste achievement (id: 7)
        const achievement = quest.active_achievements.find(ach => ach.id === '7');

        // Already an active achievement (in progress)
        if (achievement) {
            achievement.quantity = inventory.stickers_seen.length;
        } else {
            quest.active_achievements.push({id: '7', quantity: inventory.stickers_seen.length});
        }

        // Update A Piece of Cake.. Literally achievement (id: 13)
        const achievement2 = quest.active_achievements.find(ach => ach.id === '13');

        // Already an active achievement (in progress)
        if (achievement2) {
            achievement2.quantity = inventory.stickers_seen.length;
        } else {
            quest.active_achievements.push({id: '13', quantity: inventory.stickers_seen.length});
        }

        // Update The Whole Pie!.. Cake achievement (id: 16)
        const achievement3 = quest.active_achievements.find(ach => ach.id === '16');

        // Already an active achievement (in progress)
        if (achievement3) {
            achievement3.quantity = inventory.stickers_seen.length;
        } else {
            quest.active_achievements.push({id: '16', quantity: inventory.stickers_seen.length});
        }

        await quest.save();

        const completedList = quest.active_achievements.filter(ach => ach.quantity >= achievementMap.get(ach.id).quantity && ach.claimed);

        const completedList_final = [];
        completedList.forEach(ach => completedList_final.push(achievementMap.get(ach.id)));

        const activeList_final = [];
        quest.active_achievements.forEach(ach => !completedList.includes(ach) ? activeList_final.push(achievementMap.get(ach.id)): null);

        const inactiveList = [...achievementMap.values()].filter(ach => !quest.active_achievements.find(achieve => achieve.id === ach.id));

        const clientList = quest.active_achievements.filter(ach => !ach.claimed);

        const numToClaim = quest.active_achievements.filter(ach => !ach.claimed && ach.quantity >= achievementMap.get(ach.id).quantity);

        res.status(200).json([[...activeList_final, ...inactiveList], [...clientList], [...completedList_final], numToClaim.length]);

    } catch(e) {
        res.status(500).json({error: e}); 
    }

})

app.post('/claim-achievement', async(req, res) => {

    const {username, achievement, clientAchievement, isCompleted} = req.body;

    try {

        const quest = await Quest.findOne({ username: username });

        // Check if achievement reward was already claimed
        if (isCompleted){
            res.status(401).json({message: 'Achievement Already Claimed'});
            return
        }

        // Check if achievement is active
        if (!clientAchievement){
            res.status(400).json({message: 'Achievement Incomplete'});
            return
        }

        // Check if claim is valid (achievement is 100% complete)
        if (clientAchievement.quantity < achievement.quantity){
            res.status(400).json({message: 'Achievement Incomplete'});
            return
        }

        // Claim the reward
        const inventory = await Inventory.findOne({ username: username });

        if (achievement.reward?.file){

            const related_file = inventory.files.find(file => file.file_id === achievement.reward.file_id);
            if (!related_file){
                inventory.files.push({file_id: achievement.reward.file_id, quantity: 1});
            } else {
                related_file.quantity += 1;
            }
            await inventory.save();

        } else if (achievement.reward?.item){

            const related_item = inventory.collectables.find(item => item.id === achievement.reward.item_id);
            if (!related_item){
                inventory.collectables.push({id: achievement.reward.item_id, quantity: 1});
            } else {
                related_item.quantity += 1;
            }
            await inventory.save();

        }

        const related_achievement = quest.active_achievements.find(ach => ach.id === clientAchievement.id);
        related_achievement.claimed = true;
        related_achievement.date = new Date();

        await quest.save();

        res.status(200).json({message: 'Achievement claimed'});


    } catch(e) {
        res.status(500).json({error: e});  
    }

})

const marketMapSmall = new Map([
    ['0', {id: '0', item_name: 'Cold Brew', stock: 1, img: 'coffee_cup', type: 'Consumable', use: `Refreshes the top portion of the Rewards Market`, desc: 'It’s a lukewarm coffee at best', cost: {coins: true, dollar: false, file: null, amount: 150, discounted_amount: 100}}],
    ['1', {id: '1', item_name: 'Coupon', stock: 1, img: 'coupon', type: 'Consumable', use: 'Discounts the top portion of the Rewards Market', desc: `Coupons for sale? What's the point!?`, cost: {coins: true, dollar: false, file: null, amount: 200, discounted_amount: 125}}],
    ['2', {id: '2', item_name: 'Jar of Jam', stock: 1, img: 'jam', type: 'Consumable', use: "Instantly completes the 'dusting process' of a file", desc: "Just a jar.. of (probably) strawberry jam", cost: {coins: true, dollar: false, file: null, amount: 300, discounted_amount: 200}}]
])

const marketMapLarge = new Map([
    ['9', {id: '9', item_name: 'Warehouse Package', stock: 5, img: 'package_icon', type: 'Loot', use: 'Open it from your Filing Cabinet for a pleasant surprise', desc: 'A dusty, timeworn box with a label barely legible', cost: {coins: false, dollar: false, file: 'file_5', id: '40', amount: 2, discounted_amount: 1}}],
    ['8', {id: '8', item_name: 'Neatly Wrapped Gift', stock: 3, img: 'present_icon', type: 'Loot', use: 'Open it from your Filing Cabinet for a chance at a sticker', desc: "Oh wow, now that's a neatly wrapped gift!", cost: {coins: false, dollar: false, file: 'file_5', id: '40', amount: 4, discounted_amount: 3}}],
    ['7', {id: '7', item_name: 'Tiny Envelope', stock: 5, img: 'mail_icon', type: 'Loot', use: "Open it from your Filing Cabinet for a *tiny* reward", desc: "It doesn't get more tiny than a tiny envelope", cost: {coins: false, dollar: false, file: 'file_2', id: '20', amount: 2, discounted_amount: 1}}]
])

const purchaseMap = new Map([
    ['14', {id: '14', item_name: 'Sticker Basket I', stock: 5, img: 'basket', type: 'Loot', use: 'Open it from your Filing Cabinet for a guaranteed randomly chosen sticker!', desc: 'A random sticker fresh off the shelves!', cost: {coins: false, dollar: true, amount: '$1.99'}}],
    ['15', {id: '15', item_name: 'Sticker Basket II', stock: 5, img: 'basket2', type: 'Loot', use: 'Open it from your Filing Cabinet for a guaranteed sticker of your choice!', desc: 'Handpick a sticker to add to your collection', cost: {coins: false, dollar: true, amount: '$3.99'}}]
])

app.get('/fetch-market', async(req, res) => {

    const {username} = req.query;

    try {

        const inventory = await Inventory.findOne({ username: username });
        const numCoupons = inventory.collectables.find(item => item.id === '1')?.quantity;
        const numCoffees = inventory.collectables.find(item => item.id === '0')?.quantity;

        const now = new Date();

        // A new day has started
        if (now >= inventory.market_time){

            const randomIntSmall = Math.floor(Math.random() * (marketMapSmall.size));
            const smallMarket = marketMapSmall.get(randomIntSmall.toString());

            const randomIntLarge = Math.floor(Math.random() * (marketMapLarge.size)) + 7;
            const largeMarket = marketMapLarge.get(randomIntLarge.toString());
            
            inventory.market_small[0] = smallMarket;
            inventory.market_large[0] = largeMarket;

            // Update time
            const sixHoursAhead = new Date(now);

            sixHoursAhead.setHours(now.getHours() + 6);

            inventory.market_time = sixHoursAhead;

            await inventory.save();

            res.status(200).json([smallMarket, largeMarket, inventory.active_coupon, numCoupons ? numCoupons : 0, numCoffees ? numCoffees : 0, sixHoursAhead, inventory.stickers_seen.length]);

        } else {
            res.status(200).json([inventory.market_small[0], inventory.market_large[0], inventory.active_coupon, numCoupons ? numCoupons : 0, numCoffees ? numCoffees : 0, inventory.market_time, inventory.stickers_seen.length]);
        }

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post('/purchase-item', async(req, res) => {

    const {username, market, value, type} = req.body;

    try {

        const inventory = await Inventory.findOne({username: username});
        const discount = inventory.active_coupon;

        // Payment
        if (market.cost.coins){
            if (discount){
                if (inventory.currency.coins - (market.cost.discounted_amount * value) < 0){
                    res.status(400).json({message: 'Not enough coins'});
                    return;
                } else {
                    inventory.currency.coins -= (market.cost.discounted_amount * value);
                    inventory.active_coupon = false;
                }
            } else {
                if (inventory.currency.coins - (market.cost.amount * value) < 0){
                    res.status(400).json({message: 'Not enough coins'});
                    return;
                } else {
                    inventory.currency.coins -= (market.cost.amount * value);
                }
            }

        } else if (market.cost?.file){

            const relevant_file = inventory.files.find(file => file.file_id === market.cost.id);

            if (!relevant_file){
                res.status(400).json({message: 'Not enough files'});
                return;
            } else {
                if (discount){
                    if (relevant_file.quantity - (market.cost.discounted_amount * value) < 0){
                        res.status(400).json({message: 'Not enough files'});
                        return;
                    } else {
                        relevant_file.quantity -= (market.cost.discounted_amount * value);
                        inventory.active_coupon = false;
                    }
                } else {
                    if (relevant_file.quantity - (market.cost.amount * value) < 0){
                        res.status(400).json({message: 'Not enough files'});
                        return;
                    } else {
                        relevant_file.quantity -= (market.cost.amount * value);
                    }
                }
            }
        } else if (market.cost?.dollar){
            res.status(200).json({message: 'Payment processed'});
        }

        const relevant_item = inventory.collectables.find(item => item.id === market.id);

        if (!relevant_item) {
            inventory.collectables.push({id: market.id, quantity: Number(value)});
        } else {
            relevant_item.quantity += Number(value);
        }

        if (type === 0){
            inventory.market_small[0].stock -= Number(value);
            inventory.markModified('market_small');
        } 
        
        if (type === 1){
            inventory.market_large[0].stock -= Number(value);
            inventory.markModified('market_large');
        }

        const quest = await Quest.findOne({username: username});

        // Update Lucky Penny achievement (id: 6)
        const achievement = quest.active_achievements.find(ach => ach.id === '6');

        // Already an active achievement (in progress)
        if (achievement) {
            achievement.quantity += value;
        } else {
            quest.active_achievements.push({id: '6', quantity: value});
        }

        // Update The Big Bucks achievement (id: 11)
        const achievement2 = quest.active_achievements.find(ach => ach.id === '11');

        // Already an active achievement (in progress)
        if (achievement2) {
            achievement2.quantity += value;
        } else {
            quest.active_achievements.push({id: '11', quantity: value});
        }

        // Check if Merchant quest is present (id: 4)
        const relevant_quest = quest.active_quests.find(quest => quest.id === '4');

        if (relevant_quest){

            if (!relevant_quest.quantity_achieved >= 1){
                relevant_quest.quantity_achieved += 1;
            }

            await quest.save();

        }

        await quest.save();

        await inventory.save();

        res.status(200).json({message: "Item successfully purchased"});

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post('/create-checkout-session', async (req, res) => {

    const {item_name, cost, market, value} = req.body;

    try {

        const marketString = encodeURIComponent(JSON.stringify(market));

        const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'], // You can add other payment methods if needed
        line_items: [
            {
            price_data: {
                currency: 'usd',
                product_data: {
                name: item_name,
                },
                unit_amount: cost, // $20.00
            },
            quantity: value,
            },
        ],
        mode: 'payment', // Or 'subscription' for recurring payments
        success_url: `http://localhost:3000/rewards?session_id={CHECKOUT_SESSION_ID}&market=${marketString}&value=${value}`,
        cancel_url: 'http://localhost:3000/rewards',
        });
    
        res.json({ id: session.id });

    } catch(e) {
        res.status(500).json({ error: 'Verification failed' });
    }
  });
  
  app.get('/verify-payment', async (req, res) => {

    const sessionId = req.query.session_id;
    const market = JSON.parse(decodeURIComponent(req.query.market));
    const value = req.query.value;
    const username = req.query.username;

    try {

    const inventory = await Inventory.findOne({username: username});

    const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid') {

        const relevant_ticket = inventory.purchase_orders.find(ticket => ticket === sessionId);

        if (relevant_ticket){
            res.json({ paymentSuccess: false });
            return;
        } else {
            // Push ticket as verified
            inventory.purchase_orders.push(sessionId);

            // Add purchased item to inventory
            const relevant_item = inventory.collectables.find(item => item.id === market.id);

            if (relevant_item){
                relevant_item.quantity += Number(value);
            } else {
                if (market.id){
                    inventory.collectables.push({id: market.id, quantity: Number(value)});
                }
            }

            // Check if Merchant quest is present (id: 4)
            const quest = await Quest.findOne({username: username});
            const relevant_quest = quest.active_quests.find(quest => quest.id === '4');

            if (relevant_quest){

                if (!relevant_quest.quantity_achieved >= 1){
                    relevant_quest.quantity_achieved += 1;
                }

                await quest.save();

            }

            await inventory.save();

        }

        res.json({ paymentSuccess: true });
        
      } else {
        res.json({ paymentSuccess: false });
      }
    } catch (error) {
      res.status(500).json({ error: 'Verification failed' });
    }
  });


app.post('/pin-book', async(req, res) => {

    const {username, volumeId} = req.body;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === 'Favorites');
        const rel_book = tab.books.find(booky => booky.volume_id === volumeId);

        rel_book.is_pinned = !rel_book.is_pinned;

        await shelf.save();

        res.status(200).json({message: 'Book successfully pinned'});

    } catch(e) {
        res.status(500).json({ error: e});
    }

})

app.get('/getBook', async(req, res) => {

    const {username, volumeId} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === 'Favorites');
        const rel_book = tab.books.find(booky => booky.volume_id === volumeId);

        res.status(200).json(rel_book);

    } catch(e) {
        res.status(500).json({ error: e});
    }

})

app.get('/fetchActiveStickers', async(req, res) => {

    const {username, volumeId} = req.query;

    try {

        const shelf = await Bookshelf.findOne({username: username});
        const tab = shelf.tabs.find(tab => tab.tab_name === 'Favorites');
        const rel_book = tab.books.find(booky => booky.volume_id === volumeId);

        let stuff = [];

        rel_book.active_stickers.forEach(sticker => stuff.push(sticker.location));

        res.status(200).json(rel_book.active_stickers);

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.get('/fetch-all-entries', async(req, res) => {

    const {username, index} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const reversedEntries = [...shelf.total_entries].reverse();
        const arr = reversedEntries.slice(index, index + 4).slice(0, 4);
        const fillArr = arr.length >= 4 ? arr : arr.concat(Array(4 - arr.length).fill(null));


        const quest = await Quest.findOne({username: username});

        const now = new Date();

        // New day has started
        if (now >= quest.daily_quest_time){

            // Check if streak was completed yesterday
            if (!shelf.streak_today){

                shelf.streak = 0;
                await shelf.save();

            }

            shelf.streak_today = false;
            shelf.streak_claimed = false;
            await shelf.save();

            // Update time

            const midnightTomorrow = new Date(now);

            midnightTomorrow.setDate(now.getDate() + 1);
            midnightTomorrow.setHours(0, 0, 0, 0);

            quest.daily_quest_time = midnightTomorrow;

            await quest.save();

        }

        res.status(200).json([fillArr, shelf.total_entries.length, {streak: shelf.streak, is_claimed: shelf.streak_claimed, today: shelf.streak_today}]);

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post('/claim-entry-item', async(req, res) => {

    const {username, index} = req.body;

    try {

        const shelf = await Bookshelf.findOne({username: username});

        if (shelf.total_entries[shelf.total_entries.length - 1 - index].is_claimed){
            res.status(400).json({message: "Item already claimed"});
            return;
        }

        shelf.total_entries[shelf.total_entries.length - 1 - index].is_claimed = true;

        await shelf.save();

        res.status(200).json({message: "Item marked as claimed"});

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post('/ignite-streak', async(req, res) => {

    const {username} = req.body;

    try {

        const shelf = await Bookshelf.findOne({username: username});

        if (shelf.streak_claimed || !shelf.streak_today){
            res.status(400).json({message: 'Streak already ignited'});
            return;
        }

        shelf.streak_claimed = true;
        shelf.streak += 1;

        await shelf.save();

        res.status(200).json({message: "Streak Ignited"});


    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.listen(4000, () => {
    console.log("port connected");
})