import { Schema, model } from 'mongoose';

const RoomSchema = new Schema({
  token: { type: String, required: true, index: true, unique: true },
  puzzleData: { type: JSON, required: false }
})

export default model('Room', RoomSchema)