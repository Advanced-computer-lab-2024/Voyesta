const adminModel = require('../Models/Admin');
const TourismGovernor = require('../Models/tourismGovernor');
const { generateToken } = require('../utils/jwt');
const TourGuide = require('../Models/Tour Guide');
const Seller = require('../Models/Seller');
const Advertiser = require('../Models/Advertiser');
const { sendNotification } = require('./notificationController');
const touristModel = require('../Models/Tourist');
const cron = require('node-cron');
const Tourist = require('../Models/Tourist');
const Product = require('../Models/Product');
const sendGrid = require('@sendgrid/mail');
const Notification = require('../Models/Notification');

sendGrid.setApiKey('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');

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
        const admin = await adminModel.findByIdAndDelete(id);  
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
const createPromoCode = async (req, res) => {
    const { code, discount, validFrom, validUntil } = req.body;

    // Validate the required fields
    if (!code || !discount || !validFrom || !validUntil) {
        return res.status(400).json({ message: 'All fields are required: code, discount, validFrom, validUntil' });
    }

    if (discount < 0 || discount > 100) {
        return res.status(400).json({ message: 'Discount must be between 0 and 100' });
    }

    try {
        // Find the Admin document (assuming a single admin manages the promo codes)
        const admin = await adminModel.findOne();

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Check if the promo code already exists
        const existingPromoCode = admin.globalPromoCodes.find((promo) => promo.code === code);
        if (existingPromoCode) {
            return res.status(400).json({ message: 'Promo code already exists' });
        }

        // Add the promo code to the admin's promoCodes array
        const promoCode = {
            code,
            discount,
            validFrom: new Date(validFrom),
            validUntil: new Date(validUntil),
            redeemedBy: [],
            status: 'active',
        };

        admin.globalPromoCodes.push(promoCode);

        await admin.save();

        res.status(201).json({ message: 'Promo code created successfully', code, discount });
    } catch (error) {
        res.status(500).json({ message: 'Error creating promo code', error: error.message });
    }
};
const getPromoCodes = async (req, res) => {
    try {
        const admin = await adminModel.findOne();

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json(admin.globalPromoCodes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching promo codes', error: error.message });
    }
};

const createPromoCodeHelper = async (userId, username) => {
    const code = `BDAY-${username}-${Date.now()}`;
    const discount = 20; // Example discount value
    const validFrom = new Date();
    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + 1); // Promo code valid for 1 month

    try {
        const admin = await adminModel.findOne({username: 'admin'});

        if (!admin) {
            throw new Error('Admin not found');
        }

        admin.globalPromoCodes.push({ code, discount, validFrom, validUntil });
        await admin.save();

        return code;
    } catch (error) {
        console.error('Error creating promo code:', error);
        throw error;
    }
};

// Function to check birthdays and generate promo codes
const checkBirthdaysAndGeneratePromoCodes = async () => {
    console.log('Checking birthdays and generating promo codes...');
    try {
      const today = new Date();
      const month = today.getMonth() + 1; // getMonth() returns 0-11
      const day = today.getDate();
  
      console.log(`Today's date: ${today}`);
      console.log(`Month: ${month}, Day: ${day}`);
  
      const tourists = await touristModel.find({
        $expr: {
          $and: [
            { $eq: [{ $month: "$DOB" }, month] },
            { $eq: [{ $dayOfMonth: "$DOB" }, day] }
          ]
        }
      });
  
      for (const tourist of tourists) {
        const promoCode = await createPromoCodeHelper(tourist._id, tourist.username);
        
        if (!tourist.notifications){
            tourist.notifications = [];
        }
        const notification = new Notification({ message: `Your promo code is ${promoCode}. Use it whenever you want its your birthdaayyyy!!!` });
        await notification.save();

        tourist.notifications.push(notification);
        await tourist.save();

        const emailData = {
            to: tourist.email,
            from: 'voyesta@outlook.com',
            subject: 'Notification',
            text: `Your promo code is ${promoCode}. Use it whenever you want its your birthdaayyyy!!!`,
            html: `<p>${`Your promo code is ${promoCode}. Use it whenever you want its your birthdaayyyy!!!`}</p>`,
        };

        sendGrid
        .send(emailData)
        .then(() => console.log('Email sent'))
        .catch((error) => {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error sending message', error });
        });

      }
    } catch (error) {
      console.error('Error checking birthdays and generating promo codes:', error);
    }
  };
  
// Create a new promo code
const createGlobalPromoCode = async (req, res) => {
    const { code, discount, validFrom, validUntil } = req.body;

    if (!code || !discount || !validFrom || !validUntil) {
        return res.status(400).json({ message: 'All fields are required: code, discount, validFrom, validUntil' });
    }

    if (discount < 0 || discount > 100) {
        return res.status(400).json({ message: 'Discount must be between 0 and 100' });
    }

    try {
        const admin = await adminModel.findOne();

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Check if the promo code already exists
        const existingPromoCode = admin.globalPromoCodes.find((promo) => promo.code === code);

        if (existingPromoCode) {
            return res.status(400).json({ message: 'Promo code already exists' });
        }

        // Add the new promo code
        admin.globalPromoCodes.push({
            code,
            discount,
            validFrom: new Date(validFrom),
            validUntil: new Date(validUntil),
            redeemedBy: [],
            status: 'active',
        });

        await admin.save();

        res.status(201).json({ message: 'Promo code created successfully', code, discount });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Promo code already exists' });
        }
        res.status(500).json({ message: 'Error creating promo code', error: error.message });
    }
};

// Fetch all promo codes
const getGlobalPromoCodes = async (req, res) => {
    try {
        const admin = await adminModel.findOne();
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json(admin.globalPromoCodes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching promo codes', error: error.message });
    }
};

const updateGlobalPromoCode = async (req, res) => {
    const { code } = req.params; // Extract code from URL params
    const { discount, validFrom, validUntil, status } = req.body;

    //console.log("Updating promo code:", code);
    //console.log("Request body:", req.body);

    // Validate discount
    if (discount < 0 || discount > 100) {
        return res.status(400).json({ message: "Discount must be between 0 and 100" });
    }

    try {
        const admin = await adminModel.findOne();
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const promoIndex = admin.globalPromoCodes.findIndex((promo) => promo.code === code);
        if (promoIndex === -1) {
            return res.status(404).json({ message: "Promo code not found" });
        }

        // Make sure the code remains unchanged and only other fields are updated
        const updatedPromoCode = {
            ...admin.globalPromoCodes[promoIndex],  // Spread the current promo code
            discount: discount || admin.globalPromoCodes[promoIndex].discount,
            validFrom: validFrom ? new Date(validFrom) : admin.globalPromoCodes[promoIndex].validFrom,
            validUntil: validUntil ? new Date(validUntil) : admin.globalPromoCodes[promoIndex].validUntil,
            status: status || admin.globalPromoCodes[promoIndex].status,
        };

        // Ensure `code` is still present in the updated promo code
        updatedPromoCode.code = admin.globalPromoCodes[promoIndex].code;

        // Replace the old promo code with the updated one
        admin.globalPromoCodes[promoIndex] = updatedPromoCode;

        // Save the updated admin document
        await admin.save();

        res.status(200).json({ message: "Promo code updated successfully" });
    } catch (error) {
        //console.error("Error:", error);
        res.status(500).json({ message: "Error updating promo code", error: error.message });
    }
};



const deleteGlobalPromoCode = async (req, res) => {
    const { code } = req.params; // Extract code from the URL

    try {
        const admin = await adminModel.findOne();
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const promoIndex = admin.globalPromoCodes.findIndex((promo) => promo.code === code);
        if (promoIndex === -1) {
            return res.status(404).json({ message: "Promo code not found" });
        }

        // Remove the promo code from the array
        admin.globalPromoCodes.splice(promoIndex, 1);
        await admin.save();

        res.status(200).json({ message: "Promo code deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting promo code", error: error.message });
    }
};
const checkProductStockLevels = async () => {
    try {
      const outOfStockProducts = await Product.find({ available_quantity: 0 });
  
      if (outOfStockProducts.length > 0) {
        console.log('Out of stock products:');
        for (const product of outOfStockProducts) {
          const message = `Product ${product.name} is out of stock.`;
          const notification = new Notification({ message: message });
          await notification.save();
          // Notify the seller
          const seller = await Seller.findById(product.createdBy._id);
          if (seller) {
            if (!seller.notifications) {
                seller.notifications = [];
            }

            seller.notifications.push(notification);
            seller.save();

            const emailData = {
                to: seller.email,
                from: 'voyesta@outlook.com',
                subject: 'Notification',
                text: message,
                html: `<p>${message}</p>`,
            };
    
            sendGrid
            .send(emailData)
            .then(() => console.log('Email sent'))
            .catch((error) => {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error sending message', error });
            });
          }
  
          // Notify the admin
          const adminArray = await adminModel.find();
          if (adminArray.length > 0) {
            for (const admin of adminArray) {
                if (!admin.notifications) {
                    admin.notifications = [];
                }
    
                admin.notifications.push(notification);
                admin.save();
            }
          }
        }
      } else {
        console.log('No products are out of stock.');
      }
    } catch (error) {
      console.error('Error checking product stock levels:', error);
    }
  };

const validateGlobalPromoCodes = async () => {
    const admin = await adminModel.findOne();
    if (!admin) {
        console.log('No admin document found.');
        return;
    }

    for (let promo of admin.globalPromoCodes) {
        if (!['active', 'inactive', 'expired'].includes(promo.status)) {
            console.log(`Fixing invalid status for promo code: ${promo.code}`);
            promo.status = 'active';
        }
    }

    await admin.save();
    console.log('Validation completed, invalid statuses fixed.');

    
};




// Debugging Logs
console.log('getGlobalPromoCodes:', typeof getGlobalPromoCodes);

module.exports = { createAdmin, updatePassword, deleteAccount, sendOTPadmin, createTourismGovernor, getPendingUsers,getUserStats, createPromoCode,checkProductStockLevels,getPromoCodes,checkBirthdaysAndGeneratePromoCodes,createGlobalPromoCode,createGlobalPromoCode,getGlobalPromoCodes,updateGlobalPromoCode,deleteGlobalPromoCode,validateGlobalPromoCodes};