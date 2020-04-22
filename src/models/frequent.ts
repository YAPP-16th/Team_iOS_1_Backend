import { Document, Schema, model } from 'mongoose';

export type FrequentDocument = Document & {
  name: String;
  address: String;
  coordinates: [Number, Number];
};

export const FrequentSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  coordinates: {
    type: [Number, Number],
    required: true,
  },
});

const Frequent = model<FrequentDocument>('Frequent', FrequentSchema);
export default Frequent;
