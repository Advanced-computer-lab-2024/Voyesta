const Tourist = require('../Models/tourist'); // Adjust path as needed

const registerGuestTourist = async (req, res) => {
    const { username, email, password, mobileNumber, nationality, dob, jobOrStudent } = req.body;

    try {
        if (await Tourist.exists({ email })) {  // Check if a tourist profile with the email already exists
            return res.status(400).json({ message: 'Tourist already exists' });
        }
        const tourist = new Tourist({
            username,
            email,
            password, // Remember to hash the password before saving
            mobileNumber,
            nationality,
            dob,
            jobOrStudent,
        });

        await tourist.save();
        res.status(201).json({ message: 'Tourist registered successfully', tourist });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getGuestTourists = async (req, res) => {
    try {
        const tourists = await Tourist.find({});
        res.status(200).json(tourists);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



module.exports = { registerGuestTourist, getGuestTourists };
