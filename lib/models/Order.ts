import mongoose, { Schema, Model, Document } from "mongoose";

export interface IOrderItem {
  name: string;
  quantity: number;
  price: number; // Price în RON
}

export interface IOrder extends Document {
  orderId: string; // ID din Stripe/Revolut sau free-{timestamp}
  provider: "stripe" | "revolut" | "free";
  customerEmail: string;
  amountRON: number; // Prețul exact în RON la momentul checkout-ului
  amountCurrency: number; // Prețul în currency-ul selectat
  currency: string; // RON, EUR, USD, GBP
  status: string; // paid, COMPLETED, AUTHORISED, etc.
  paymentIntentId?: string; // ID-ul payment intent-ului (dacă există)
  items: IOrderItem[];
  discountPercentage?: number;
  discountCode?: string;
  metadata?: {
    language?: string;
    originalCurrency?: string;
    exchangeRate?: number;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
}, { _id: false });

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    provider: { type: String, required: true, enum: ["stripe", "revolut", "free"] },
    customerEmail: { type: String, required: true, index: true },
    amountRON: { type: Number, required: true },
    amountCurrency: { type: Number, required: true },
    currency: { type: String, required: true, default: "RON" },
    status: { type: String, required: true },
    paymentIntentId: { type: String, index: true },
    items: { type: [OrderItemSchema], required: true },
    discountPercentage: { type: Number },
    discountCode: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index pentru query-uri rapide
OrderSchema.index({ createdAt: -1 }); // Pentru sortare descendentă
OrderSchema.index({ customerEmail: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
