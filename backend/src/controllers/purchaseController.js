// controllers/purchaseController.js
const Purchase = require('../Models/Purchase');

const createPurchase = async (req, res) => {
    const { productId, touristId, quantity } = req.body;
    try {
        const newPurchase = new Purchase({ productId, touristId, quantity });
        await newPurchase.save();
        res.status(201).json({ success: true, data: newPurchase });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating purchase', error: error.message });
    }
};

const getPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find().populate('productId').populate('touristId');
        res.status(200).json({ success: true, data: purchases });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching purchases', error: error.message });
    }
};

const getPurchaseById = async (req, res) => {
    const { id } = req.params;
    try {
        const purchase = await Purchase.findById(id).populate('productId').populate('touristId');
        if (!purchase) {
            return res.status(404).json({ success: false, message: 'Purchase not found' });
        }
        res.status(200).json({ success: true, data: purchase });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching purchase', error: error.message });
    }
};

const updatePurchase = async (req, res) => {
    const { id } = req.params;
    const { productId, touristId, quantity } = req.body;
    try {
        const updatedPurchase = await Purchase.findByIdAndUpdate(id, { productId, touristId, quantity }, { new: true });
        if (!updatedPurchase) {
            return res.status(404).json({ success: false, message: 'Purchase not found' });
        }
        res.status(200).json({ success: true, data: updatedPurchase });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating purchase', error: error.message });
    }
};

const deletePurchase = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPurchase = await Purchase.findByIdAndDelete(id);
        if (!deletedPurchase) {
            return res.status(404).json({ success: false, message: 'Purchase not found' });
        }
        res.status(200).json({ success: true, message: 'Purchase deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting purchase', error: error.message });
    }
};

module.exports = {
    createPurchase,
    getPurchases,
    getPurchaseById,
    updatePurchase,
    deletePurchase
};