// #Task route solution

const sellerModel = require('../Models/Seller.js');

const { default: mongoose } = require('mongoose');

const createSeller = async (req, res) => {
   const { Username, Email, Password } = req.body;

   try {
       const seller = await sellerModel.create({ Username, Email, Password });
       res.status(200).json(seller);
   } catch (error) { // Corrected catch syntax
       res.status(400).json({ error: error.message });
   }
};


const getSellers = async (req, res) => {
   try {
       const sellers = await sellerModel.find({});
       res.status(200).json(sellers);
   } catch (error) { // Corrected catch syntax
       res.status(400).json({ error: error.message });
   }
};



const updateSeller = async (req, res) => {
   const { Username, Email, Password } = req.body;

   try {
       const seller = await sellerModel.findOneAndUpdate(
           { Username: Username }, // Find by Username
           { Email: Email, Password: Password }, // Update these fields
           { new: true } // Return the updated document
       );

       if (!seller) {
           return res.status(404).json({ error: 'Seller not found' });
       }

       res.status(200).json(seller);
   } catch (error) { // Corrected catch syntax
       res.status(400).json({ error: error.message });
   }
};


const deleteSeller = async (req, res) => {
    const { Username } = req.body; // Extract Username from the request body

    try {
        // Attempt to delete the advertiser by Username
        const seller = await sellerModel.findOneAndDelete({ Username: Username });

        // Check if the advertiser was found and deleted
        if (!seller) {
            return res.status(404).json({ error: 'No such Seller' });
        }

        // Respond with a success message and the deleted advertiser's information
        res.status(200).json({ message: 'Seller deleted successfully', seller });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {createSeller, getSellers, updateSeller, deleteSeller};
