// #Task route solution

const tourguideModel = require('../Models/Tour Guide.js');

const { default: mongoose } = require('mongoose');

const createTourGuide = async(req,res) => {
   const{Username,Email,Password,Number,Years_Of_Experience,Previous_Work}= req.body;
   try{
      const tourguide= await tourguideModel.create({Username,Email,Password,Number,Years_Of_Experience,Previous_Work});
      res.status(200).json(tourguide);


   }catch{error}{
      res.status(400).json({error:error.message})
   }


}

const getTourGuides = async (req, res) => {
   try{
    const tourguides=await tourguideModel.find({});
    res.status(200).json(tourguides);
 
   
 }catch{error}{
    res.status(400).json({error:error.message})
 }}


 const updateTourGuide = async (req, res) => {
   const { Username,Email,Password,Number,Years_Of_Experience,Previous_Work } = req.body;

   try {
       const tourguide = await tourguideModel.findOneAndUpdate(
           { Email: Email }, // Find by Email
           { Username:Username, Password: Password,Number:Number,Years_Of_Experience:Years_Of_Experience,Previous_Work:Previous_Work }, // Update these fields
           { new: true } // Return the updated document
       );

       if (!tourguide) {
           return res.status(404).json({ error: 'Tour guide not found' });
       }

       res.status(200).json(tourguide);
   } catch (error) { // Corrected catch syntax
       res.status(400).json({ error: error.message });
   }
};

const deleteTourGuide = async (req, res) => {
   const { Username } = req.body; // Extract Username from the request body

   try {
       // Attempt to delete the advertiser by Username
       const tourguide = await tourguideModel.findOneAndDelete({ Username: Username });

       // Check if the advertiser was found and deleted
       if (!tourguide) {
           return res.status(404).json({ error: 'No such Tour guide' });
       }

       // Respond with a success message and the deleted advertiser's information
       res.status(200).json({ message: 'Tour guide deleted successfully', tourguide });
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};


module.exports = {createTourGuide, getTourGuides, updateTourGuide, deleteTourGuide};
