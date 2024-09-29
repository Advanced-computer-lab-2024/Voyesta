// #Task route solution

const adModel = require('../Models/Advertiser.js');

const { default: mongoose } = require('mongoose');

const createAdvertiser = async (req, res) => {
   const { Username, Email, Password } = req.body;

   try {
       const advertiser = await adModel.create({ Username, Email, Password });
       res.status(200).json(advertiser);
   } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

const getAdvertisers = async (req, res) => {
   try {
       const advertisers = await adModel.find({});
       res.status(200).json(advertisers);
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};


const updateAdvertiser = async (req, res) => {
    const { Username, Email, Password } = req.body;
 
    try {
        const advertiser = await adModel.findOneAndUpdate(
            { Username: Username }, // Find by Username
            { Email: Email, Password: Password }, // Update these fields
            { new: true } // Return the updated document
        );
 
        if (!advertiser) {
            return res.status(404).json({ error: 'advertiser not found' });
        }
 
        res.status(200).json(advertiser);
    } catch (error) { // Corrected catch syntax
        res.status(400).json({ error: error.message });
    }
 };

 const deleteAdvertiser = async (req, res) => {
    const { Username } = req.body; // Extract Username from the request body

    try {
        // Attempt to delete the advertiser by Username
        const advertiser = await adModel.findOneAndDelete({ Username: Username });

        // Check if the advertiser was found and deleted
        if (!advertiser) {
            return res.status(404).json({ error: 'No such advertiser' });
        }

        // Respond with a success message and the deleted advertiser's information
        res.status(200).json({ message: 'Advertiser deleted successfully', advertiser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



module.exports = {createAdvertiser, getAdvertisers, updateAdvertiser, deleteAdvertiser};
