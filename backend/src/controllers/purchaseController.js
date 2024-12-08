// controllers/purchaseController.js
const Purchase = require('../Models/purchase');
const sendGrid = require('@sendgrid/mail');
sendGrid.setApiKey('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');

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

const createPurchasesFromCart = async (req, res) => {
    const { cartItems } = req.body;
    const touristId = req.user.id;
    try {
        const purchases = [];
        console.log(cartItems);
        for (const item of cartItems) {
            const { productId, quantity } = item;
            const newPurchase = new Purchase({ productId, touristId, quantity });
            await newPurchase.save();
            purchases.push(newPurchase);
        }
        res.status(201).json({ success: true, data: purchases });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating purchases from cart', error: error.message });
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

const sendPaymentReceipt = async (req, res) => {
    const { email, total, paymentMethod, details } = req.body;
    
    const message = {
        to: email,
        from: 'voyesta@outlook.com', // Your verified sender email
        subject: 'Payment Receipt',
        text: `Thank you for your payment of $${total.toFixed(2)} using ${paymentMethod}.`,
        html: `
          <p>Thank you for your payment of <strong>$${total.toFixed(2)}</strong> using <strong>${paymentMethod}</strong>.</p>
          <h3>Order Details:</h3>
            <p>${details}</p>
          <p><strong>Grand Total: $${total.toFixed(2)}</strong></p>
        `,
    };

    try {
        await sendGrid.send(message);
        res.status(200).json({ message: 'Payment receipt sent successfully' });
    } catch (error) {
        console.error('Error sending payment receipt:', error);
        res.status(500).json({ message: 'Error sending payment receipt', error: error.message });
    }
};

module.exports = {
    createPurchase,
    getPurchases,
    getPurchaseById,
    updatePurchase,
    deletePurchase,
    sendPaymentReceipt,
    createPurchasesFromCart,
};