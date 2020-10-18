import mongoose from 'mongoose';

const { Schema } = mongoose;

const thingSchema: mongoose.Schema = new Schema({
  content: String,
  adder: String,
  date: { type: Date, default: Date.now },
});

export const Thing = mongoose.model('TwitchThing', thingSchema);
