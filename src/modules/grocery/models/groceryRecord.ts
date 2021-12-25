import mongoose from 'mongoose';
import { MAX_GROCERY_ITEM_LENGTH } from '../constants';
import { GroceryList } from '../types';

const groceryListSchema = new mongoose.Schema(
  {
    chatId: {
      type: Number,
      required: true,
    },
    items: {
      type: [
        {
          type: String,
          trim: true,
          minlength: 1,
          maxlength: MAX_GROCERY_ITEM_LENGTH,
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

const GroceryListModel = mongoose.model<GroceryList>('GroceryList', groceryListSchema);

export default GroceryListModel;
