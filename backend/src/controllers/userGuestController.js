const User = require('../Models/UserGuest'); // Adjust path as needed

const registerGuestUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const user = new User({
            username,
            email,
            password, // Remember to hash the password before saving
            role,
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getGuestUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { registerGuestUser, getGuestUsers };
