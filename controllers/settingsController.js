import Settings from "../models/Settings.js";

// Get settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    const settingsData = JSON.parse(req.body.settingsData || "{}");
    if (req.file) {
      settingsData.logo = req.file.path;
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(settingsData);
    } else {
      Object.assign(settings, settingsData);
    }

    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 