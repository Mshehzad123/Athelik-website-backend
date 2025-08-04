import Settings from "../models/Settings.js";

// Get settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings with USD currency
      settings = new Settings({ currency: "USD" });
      await settings.save();
    }
    // Only return the currency field to match frontend expectations
    res.json({ currency: settings.currency });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    const settingsData = JSON.parse(req.body.settingsData || "{}");
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(settingsData);
    } else {
      // Only update currency field
      if (settingsData.currency) {
        settings.currency = settingsData.currency;
      }
    }

    await settings.save();
    // Only return the currency field to match frontend expectations
    res.json({ currency: settings.currency });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
}; 