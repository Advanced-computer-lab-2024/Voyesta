// #Task route solution

const touristModel = require('../Models/Tourist');

const { default: mongoose } = require('mongoose');
const{otpSender} = require('../services/generateOTPgenric');
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
    const { id } = req.params; // Extract ID from URL parameters
    const { Username, Email, Password, Number, Nationality, Job } = req.body;

    try {
        // Use findByIdAndUpdate to update the tourist by ID
        const tourist = await touristModel.findByIdAndUpdate(
            id, // Find by ID
            { Username, Email, Password, Number, Nationality, Job }, // Update these fields
            { new: true, runValidators: true } // Return the updated document and validate
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
    const { id } = req.params; // Extract ID from URL parameters

    try {
        // Attempt to delete the tourist by ID
        const tourist = await touristModel.findByIdAndDelete(id); // Find and delete by ID

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
// Send OTP to email
const sendOTPtourist = async (req, res) => {
   const { Email } = req.body;

   try {
       const response = await otpSender(touristModel, Email);
       res.json(response);
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};

module.exports = {createTourist, getTourists, updateTourist, deleteTourist,  sendOTPtourist}; // Export the controller functions
