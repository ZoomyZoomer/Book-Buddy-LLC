const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const pageEntrySchema = new Schema({
  volume_id: {
    type: String
  },
  is_claimed: {
    type: Boolean,
    default: false
  },
  title: {
    type: String
  },
  pages_added: {
    type: Number,
    required: true
  },
  new_page_total: {
    type: Number,
    required: true
  },
  summary: {
    type: String
  },
  icon: {
    name: {
      type: String
    },
    display: {
      type: String
    },
    tier: {
      type: String
    },
    rarity: {
      type: String
    },
    value: {
      type: Number
    },
    desc: {
      type: String
    }
  },
  streak: {
    days: {
      type: Number
    },
    dates: []
  },
  date: {
    month: {
      type: String,
      required: true
    },
    day: {
      type: String,
      required: true
    },
    year: {
      type: String,
      required: true
    }
  }
});

const tiersLoot = new Schema({
  tier: {
    type: Number
  },
  name: {
    type: String
  },
  display: {
    type: String
  },
  coins: {
    type: Number
  },
  xp: {
    type: Number
  },
  date: {
    type: String
  },
  loot: {
    name: {
      type: String
    },
    rarity: {
      type: String
    },
    value: {
      type: Number
    },
    desc: {
      type: String
    }
  }
})

const bookEntrySchema = new Schema({
  volume_id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  cover: {
    type: String
  },
  author: {
    type: String
  },
  genre: {
    type: String
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  active_stickers: [],
  is_favorite: {
    type: Boolean,
    default: false
  },
  is_completed: {
    type: Boolean,
    default: false
  },
  is_pinned: {
    type: Boolean,
    default: false
  },
  pages_read: {
    type: Number
  },
  total_pages: {
    type: Number
  },
  stickers: {
    top_cover: {
      type: String
    },
    bottom_cover: {
      type: String
    },
    border: {
      type: String
    }
  },
  reward_tiers_claimed: [],
  reward_tiers_loot: [tiersLoot],
  page_entries: [pageEntrySchema],
  icon_set: {
    type: String
  }
});

const tabSchema = new Schema({
  tab_name: {
    type: String
  },
  last_read: [],
  books: [bookEntrySchema] // Embedded document for books
});

const genreColorSchema = new Schema({
  genre: {
    type: String,
    required: true
  },
  color: {
    type: String
  }
});

const bookshelfSchema = new Schema({
  username: {
    type: String,
    unique: true, // Enforce unique constraint on username
    required: true
  },
  tabs: [tabSchema],
  total_entries: [pageEntrySchema],
  genre_colors: [genreColorSchema],
  color_collection: [],
  default_color: {
    type: String,
    required: true
  },
  streak: {
    type: Number,
    default: 0
  },
  streak_claimed: {
    type: Boolean,
    default: false
  },
  streak_today: {
    type: Boolean,
    default: false
  },
  streak_dates: [],
  curr_day: {
    type: Date
  },
  settings: {
    bookBot_intro: {
      type: Boolean
    },
    entry_default_icon: {
      type: String
    }
  }
});
const BookshelfModel = model('Bookshelf', bookshelfSchema);

module.exports = BookshelfModel;
