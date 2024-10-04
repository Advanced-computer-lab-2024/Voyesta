const GuestTourist = require('../Models/GuestTourist.js'); // Ensure the path is correct

const registerGuestTourist = async (req, res) => {
    const { username, email, password, mobileNumber, nationality, dob, jobOrStudent } = req.body;

    try {
<<<<<<< HEAD
        const guestTourist = new GuestTourist({ // Ensure consistent variable naming
=======
        if (await Tourist.exists({ email })) {  // Check if a tourist profile with the email already exists
            return res.status(400).json({ message: 'Tourist already exists' });
        }
        const tourist = new Tourist({
>>>>>>> d9374484166dc31a29bd53fd4e8c44bb5bf425d5
            username,
            email,
            password, // Remember to hash the password before saving
            mobileNumber,
            nationality,
            dob,
            jobOrStudent,
        });

        await guestTourist.save();
        res.status(201).json({ message: 'Guest tourist registered successfully', guestTourist }); // Use the correct variable name
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getGuestTourists = async (req, res) => {
    try {
        const guestTourists = await GuestTourist.find({});
        res.status(200).json(guestTourists);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



module.exports = { registerGuestTourist, getGuestTourists };
