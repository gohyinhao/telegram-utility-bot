import mongoose from 'mongoose';
import { MAX_GROCERY_ITEM_LENGTH } from '../constants';
import { GroceryList } from '../types';

const GroceryListSchema = new mongoose.Schema(
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

const GroceryListModel = mongoose.model<GroceryList>('GroceryList', GroceryListSchema);

export default GroceryListModel;
