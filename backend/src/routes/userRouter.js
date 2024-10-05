const express = require('express');
const userGuestRouter = express.Router();
//const jwt = require('jsonwebtoken');
const userGuestController = require('../controllers/userController');

// Register a guest user
userGuestRouter.post('/registerGuestUser', userGuestController.registerGuestUser);
// Get all guest users
userGuestRouter.get('/getGuestUsers', userGuestController.getUsers);



// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user || !(await user.comparePassword(password))) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
//         res.status(200).json({ token });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });



module.exports = userGuestRouter;