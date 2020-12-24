const mongoose = require("mongoose");

const statisticSchema = mongoose.Schema({
  newUsers: {
    type: Number,
    default: 0,
  },
  activeUsers: {
    type: Number,
    default: 0,
  },
  soldItems: {
    type: Number,
    default: 0,
  },
  usedCodes: {
    type: Number,
    default: 0,
  },
  blogs: {
    type: Number,
    default: 0,
  },
  cash: {
    type: Number,
    default: 0,
  },
});

// Add plugins
statisticSchema.set("timestamps", true);

module.exports = mongoose.model("Statistic", statisticSchema);
