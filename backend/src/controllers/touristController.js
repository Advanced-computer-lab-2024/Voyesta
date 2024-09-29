// #Task route solution

const touristModel = require('../Models/tourist.js');

const { default: mongoose } = require('mongoose');

const createTourist = async(req,res) => {
   const{Email,Username,Password,Number,Nationality,Job}= req.body;
   try{
      const tourguide= await touristModel.create({Email,Username,Password,Number,Nationality,Job});
      res.status(200).json(tourguide);


   }catch{error}{
      res.status(400).json({error:error.message})
   }


}

const getTourists = async (req, res) => {
   try{
    const tourguides=await touristModel.find({});
    res.status(200).json(tourguides);
 
   
 }catch{error}{
    res.status(400).json({error:error.message})
 }}


 const updateTourist = async (req, res) => {
   const { Username, Email, Password, Number, Nationality, Job } = req.body;

   try {
       // Use findOneAndUpdate to update the tourist by Email
       const tourist = await touristModel.findOneAndUpdate(
           { Email: Email }, // Find by Email
           { Username: Username, Password: Password, Number: Number, Nationality: Nationality, Job: Job }, // Update these fields
           { new: true } // Return the updated document
       );

       // Check if the tourist was found
       if (!tourist) {
           return res.status(404).json({ error: 'Tourist not found' });
       }

       // Respond with the updated tourist information
       res.status(200).json(tourist);
   } catch (error) {
       // Handle any errors that may occur
       res.status(400).json({ error: error.message });
   }
};


const deleteTourist = async (req, res) => {
   const { Email } = req.body; // Extract Email from the request body

   try {
       // Attempt to delete the tourist by Email
       const tourist = await touristModel.findOneAndDelete({ Email: Email });

       // Check if the tourist was found and deleted
       if (!tourist) {
           return res.status(404).json({ error: 'No such tourist' });
       }

       // Respond with the deleted tourist's information
       res.status(200).json({ message: 'Tourist deleted successfully', tourist });
   } catch (error) {
       // Handle any errors that may occur
       res.status(400).json({ error: error.message });
   }
};


module.exports = {createTourist, getTourists, updateTourist, deleteTourist};
