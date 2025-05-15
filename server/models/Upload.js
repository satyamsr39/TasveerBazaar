const mongoose=require('mongoose')

const uploadSchema = new mongoose.Schema({
  filename: String,
  url: String,
  uploadedBy: String, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Upload', uploadSchema);

