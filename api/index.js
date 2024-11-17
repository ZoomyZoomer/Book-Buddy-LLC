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


app.listen(4000, () => {
    console.log("port connected");
})