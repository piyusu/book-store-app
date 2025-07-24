import mongoose, { Document, Schema } from "mongoose";

export interface IcartItem extends Document {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface Icart extends Document {
  user: mongoose.Types.ObjectId;
  items: IcartItem[];
}

const CartItemsSchema = new Schema<IcartItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const CartSchema = new Schema<Icart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [CartItemsSchema],
  },
  { timestamps: true }
);

export default mongoose.model<Icart>("Cart", CartSchema);
