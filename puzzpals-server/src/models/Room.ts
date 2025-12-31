import { Schema, model } from 'mongoose';

const RoomSchema = new Schema({
  token: { type: String, required: true, index: true, unique: true }
})

export default model('Room', RoomSchema)