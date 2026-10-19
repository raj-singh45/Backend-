const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  name: { type: String, required: true, trim: true },
  category: { type: String, trim: true, default: "Other" },
  price: { type: Number, required: true, min: 0 },
  isVeg: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
});

 menuItemSchema.index({ restaurant: 1 });
const menuItemModel =  mongoose.model("MenuItem", menuItemSchema);
menuItemModel.createIndexes({restaurant:1}) 
module.exports = menuItemModel
