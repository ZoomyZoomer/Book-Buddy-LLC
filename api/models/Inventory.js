const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const ItemSchema = new Schema({
    item: {
        type: String
    },
    quantity: {
        type: Number,
        default: 0
    },
    max: {
        type: Number
    }
});

const ItemSetSchema = new Schema({
    item_set_id: {
        type: String
    },
    item_set: [ItemSchema]
});

const Sticker = new Schema({
    sticker_id: {
        type: String
    },
    sticker_name: {
        type: String
    },
    sticker_display: {
        type: String
    },
    sticker_set: {
        set: {
            type: String
        },
        unique_color: {
            type: String
        },
        border_color: {
            type: String
        },
        background_color: {
            type: String
        },
        unique_color_name: {
            type: String
        },
        set_item_id: {
            type: Number
        }
    },
    quantity: {
        type: Number
    }
})

const StickerSchema = new Schema({
    Top_cover: [Sticker],
    Bottom_cover: [Sticker]
})

const FileSchema = new Schema({
    file_id: {
        type: String
    },
    quantity: {
        type: Number,
        default: 0
    }
})

const StickerCollectionSchema = new Schema({
    sticker_id: {
        type: String
    },
    date_acquired: {
        type: String
    }
})

const ActiveFileSchema = new Schema({
    file_id: {
        type: String
    },
    index: [],
    date_init: {
        type: Date
    }
})

const CollectableSchema = new Schema({
    id: {
        type: String
    },
    quantity: {
        type: Number,
        default: 0
    }
})


const InventorySchema = new Schema({
    username: {
        type: String,
        required: true
    },
    items: [ItemSetSchema],
    stickers: [StickerSchema],
    files_seen: [],
    files: [FileSchema],
    stickers_seen: [],
    sticker_collection: [StickerCollectionSchema],
    collectables: [CollectableSchema],
    warehouse_grid: [],
    market_small: [],
    market_large: [],
    selected_stickers: [],
    purchase_orders: [],
    max_patch: {
        type: Number,
        default: 0
    },
    market_time: {
        type: Date,
        default: null
    },
    active_coupon: {
        type: Boolean,
        default: false
    },
    active_files: [ActiveFileSchema],
    currency:{
        coins: {
            type: Number,
            default: 200
        },
        xp: {
            type: Number,
            default: 0
        }
    }
});

const InventoryModel = model('Inventory', InventorySchema);

module.exports = InventoryModel;