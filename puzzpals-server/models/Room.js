const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  token: { type: String, required: true, index: true, unique: true }
})

module.exports = mongoose.model('Room', RoomSchema)