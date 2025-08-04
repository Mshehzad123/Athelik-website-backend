import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  currency: { 
    type: String, 
    default: "USD" 
  }
}, {
  timestamps: true
});

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings; 