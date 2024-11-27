const adminModel = require('../Models/Admin');
const TourismGovernor = require('../Models/tourismGovernor');
const { generateToken } = require('../utils/jwt');
const TourGuide = require('../Models/Tour Guide');
const Seller = require('../Models/Seller');
const Advertiser = require('../Models/Advertiser');
const Tourist = require('../Models/Tourist'); 
const User=require('../Models/User'); 

// Create a new Admin profile
const createAdmin = async (req , res) => {
    const { username, password } = req.body;

    try {
        if (await adminModel.exists({ username })) {  // Check if an admin profile with the username already exists
            return res.status(400).json({ message: 'Admin already exists' });
        }
        const newAdmin = new adminModel({
            username,
            password, // Remember to hash the password before saving in production
        });
        const latestAdmin = newAdmin.save();
        console.log(latestAdmin);
        
        const token = generateToken(latestAdmin._id, 'admin');
        res.status(201).json({ message: 'Admin profile created successfully', token, latestAdmin });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// update Password
const updatePassword = async (req, res) => {
    const id = req.user.id; // Extract id from URL parameters
    const { oldPassword,newPassword } = req.body; // Extract new password from request body

    try {
       const admin = await adminModel.findById({ id });
       if(!admin) {
           return res.status(404).json({ message: 'Admin not found' });
       }

         // Check if the old password matches the one in the database
         if(oldPassword !== admin.password) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        admin.password = newPassword; // Update the password
        await admin.save(); // Save the updated admin profile
        res.json({ message: 'Password updated successfully', admin });

    }
     catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an Admin profile
const deleteAccount = async (req, res) => {
    const id = req.user.id;
    try {
        const admin = await adminModel.findByIdAndDelete({ id });  
        if(!admin) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User profile deleted successfully', admin });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
// forget password endpoint
const sendOTPadmin = async (req, res) => {
    const { email } = req.body;
    try {
        const response = await otpSender(adminModel, email);
        res.json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller function to create a new tourism governor
const createTourismGovernor = async (req, res) => {
    
    const { username, password } = req.body;

    // Ensure username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Create and save the new Tourism Governor
        const newGovernor = new TourismGovernor({ username, password });

        const savedGovernor = await newGovernor.save();
        const token = generateToken(savedGovernor._id, 'tourismGoverner')

        
        return res.status(201).json({ message: 'Tourism Governor created successfully', token, governor: savedGovernor });
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate username error
            return res.status(400).json({ message: 'Username already exists' });
        }
        return res.status(500).json({ message: 'Error creating Tourism Governor', error: error.message });
    }
};



const getUserStats = async (req, res) => {
    try {
        console.log('Fetching user stats...');

        // Count documents in each collection for total users
        const touristCount = await Tourist.countDocuments();
        const advertiserCount = await Advertiser.countDocuments();
        const sellerCount = await Seller.countDocuments();
        const tourGuideCount = await TourGuide.countDocuments();

        // Total number of all roles
        const totalUsers = touristCount + advertiserCount + sellerCount + tourGuideCount;

        console.log("Counts by Role:");
        console.log("Tourists:", touristCount);
        console.log("Advertisers:", advertiserCount);
        console.log("Sellers:", sellerCount);
        console.log("Tour Guides:", tourGuideCount);
        console.log("Total Users:", totalUsers);

        // Aggregation to count the number of new tourists by month
        const monthlyTouristStats = await Tourist.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" }, // Extract year
                        month: { $month: "$createdAt" } // Extract month
                    },
                    count: { $sum: 1 } // Count new tourists per month
                }
            },
            {
                $sort: {
                    "_id.year": 1, // Sort by year
                    "_id.month": 1 // Then by month
                }
            }
        ]);

        // Aggregation to count the number of new advertisers by month
        const monthlyAdvertiserStats = await Advertiser.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" }, // Extract year
                        month: { $month: "$createdAt" } // Extract month
                    },
                    count: { $sum: 1 } // Count new advertisers per month
                }
            },
            {
                $sort: {
                    "_id.year": 1, // Sort by year
                    "_id.month": 1 // Then by month
                }
            }
        ]);

        // Aggregation to count the number of new sellers by month
        const monthlySellerStats = await Seller.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" }, // Extract year
                        month: { $month: "$createdAt" } // Extract month
                    },
                    count: { $sum: 1 } // Count new sellers per month
                }
            },
            {
                $sort: {
                    "_id.year": 1, // Sort by year
                    "_id.month": 1 // Then by month
                }
            }
        ]);

        // Aggregation to count the number of new tour guides by month
        const monthlyTourGuideStats = await TourGuide.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" }, // Extract year
                        month: { $month: "$createdAt" } // Extract month
                    },
                    count: { $sum: 1 } // Count new tour guides per month
                }
            },
            {
                $sort: {
                    "_id.year": 1, // Sort by year
                    "_id.month": 1 // Then by month
                }
            }
        ]);

        // Format the stats for better readability
        const formattedMonthlyTouristStats = monthlyTouristStats.map(stat => ({
            year: stat._id.year,
            month: stat._id.month,
            count: stat.count
        }));

        const formattedMonthlyAdvertiserStats = monthlyAdvertiserStats.map(stat => ({
            year: stat._id.year,
            month: stat._id.month,
            count: stat.count
        }));

        const formattedMonthlySellerStats = monthlySellerStats.map(stat => ({
            year: stat._id.year,
            month: stat._id.month,
            count: stat.count
        }));

        const formattedMonthlyTourGuideStats = monthlyTourGuideStats.map(stat => ({
            year: stat._id.year,
            month: stat._id.month,
            count: stat.count
        }));

        // Return all stats (total users, role stats, and monthly stats for each role)
        return res.json({
            totalUsers,
            roleStats: {
                tourists: touristCount,
                advertisers: advertiserCount,
                sellers: sellerCount,
                tourGuides: tourGuideCount
            },
            monthlyStats: {
                tourists: formattedMonthlyTouristStats,
                advertisers: formattedMonthlyAdvertiserStats,
                sellers: formattedMonthlySellerStats,
                tourGuides: formattedMonthlyTourGuideStats
            }
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        return res.status(500).json({ message: "Error fetching stats" });
    }
};





// Fetch all pending users from TourGuide, Seller, and Advertiser collections
const getPendingUsers = async (req, res) => {
    try {
        const pendingTourGuides = await TourGuide.find({ status: 'pending' });
        const pendingSellers = await Seller.find({ status: 'pending' });
        const pendingAdvertisers = await Advertiser.find({ status: 'pending' });

        const formatUser = (user, userType) => ({
            userType,
            name: user.username,
            id: user._id,
            personalId: user.personalId || null,
            additionalDocument: user.additionalDocument || null
        });

        const pendingUsers = [
            ...pendingTourGuides.map(user => formatUser(user, 'TourGuide')),
            ...pendingSellers.map(user => formatUser(user, 'Seller')),
            ...pendingAdvertisers.map(user => formatUser(user, 'Advertiser'))
        ];

        res.status(200).json(pendingUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createAdmin, updatePassword, deleteAccount, sendOTPadmin, createTourismGovernor, getPendingUsers,getUserStats };