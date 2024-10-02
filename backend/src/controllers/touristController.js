// #Task route solution

const touristModel = require('../Models/Tourist');

const { default: mongoose } = require('mongoose');
const{otpSender} = require('../services/generateOTPgenric');
const createTourist = async (req, res) => {
   const { Username, Email, Password, Number, Nationality, DOB, Job } = req.body;

   try {
       if (await Tourist.exists({ email })) {  // Check if a tourist profile with the email already exists
           return res.status(400).json({ message: 'Tourist already exists' });
       }
       const tourist = new Tourist({
           Username,
           Email,
           Password, // Remember to hash the password before saving
           Number,
           Nationality,
           DOB,
           Job,
           Wallet
       });

       await tourist.save();
       res.status(201).json({ message: 'Tourist registered successfully', tourist });
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};

const getTourists = async (req, res) => {
   try{
    const tourist=await touristModel.find({});
    res.status(200).json(tourist);
 
   
 }catch{error}{
    res.status(400).json({error:error.message})
 }};


// gets a tourist by username displaying all its information
 const getTourist = async (req, res) => {
    const { Username } = req.prams;
    try{
     const tourist=await touristModel.find({Username:Username});
     if(!tourist){
        return res.status(404).json({error:'Tourist not found'});
     }  
     
     res.status(200).json(tourist);
  
    
  }catch{error}{
     res.status(400).json({error:error.message})
  }};


 const updateTourist = async (req, res) => {
   const { Email, Password, Number, Nationality, Job } = req.body;
   const { Username } = req.params;
   
   // Create an object containing the fields to update
   const updateFields = {};
    if (Email) updateFields.Email = Email;
    if (Password) updateFields.Password = Password;
    if (Number) updateFields.Number = Number;
    if (Nationality) updateFields.Nationality = Nationality;
    if (Job) updateFields.Job = Job;
   
   try {
       // Use findOneAndUpdate to update the tourist by Email
       const tourist = await touristModel.findOneAndUpdate(
           { Username: Username}, // Find by Email
           { $set: updateFields}, // Update these fields
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

module.exports = {createTourist, getTourists, updateTourist, deleteTourist,  sendOTPtourist , getTourist}; // Export the controller functions
