import Bundle from "../models/Bundle.js";

// Get all bundles
export const getBundles = async (req, res) => {
  try {
    const bundles = await Bundle.find().populate("products");
    res.json(bundles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new bundle
export const createBundle = async (req, res) => {
  try {
    const bundle = new Bundle(req.body);
    await bundle.save();
    res.status(201).json(bundle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 