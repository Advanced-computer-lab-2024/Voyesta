const adminModel = require('../Models/Admin');
const TourismGovernor = require('../Models/tourismGovernor');
const { generateToken } = require('../utils/jwt');
const TourGuide = require('../Models/Tour Guide');
const Seller = require('../Models/Seller');
const Advertiser = require('../Models/Advertiser');


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
    const { code, discount, validFrom, validUntil, usageLimit } = req.body;

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
        const existingPromoCode = admin.promoCodes.find((promo) => promo.code === code);
        if (existingPromoCode) {
            return res.status(400).json({ message: 'Promo code already exists' });
        }

        // Add the promo code to the admin's promoCodes array
        const promoCode = {
            code,
            discount,
            validFrom: new Date(validFrom),
            validUntil: new Date(validUntil),
            usageLimit,
        };

        admin.promoCodes.push(promoCode);

        await admin.save();

        res.status(201).json({ message: 'Promo code created successfully', promoCode });
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

        res.status(200).json(admin.promoCodes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching promo codes', error: error.message });
    }
};



const assignBirthdayPromoCode = async (req, res) => {
    const { touristId, email, code, discount } = req.body; // Accept tourist ID or email, promo code, and discount

    if (!touristId && !email) {
        return res.status(400).json({ message: 'Tourist ID or email is required' });
    }
    if (!code || !discount) {
        return res.status(400).json({ message: 'Promo code and discount are required' });
    }
    if (discount < 0 || discount > 100) {
        return res.status(400).json({ message: 'Discount must be between 0 and 100' });
    }

    try {
        // Find the tourist by ID or email
        const tourist = await touristModel.findOne(touristId ? { _id: touristId } : { email });
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        const today = new Date();
        const birthDate = new Date(tourist.DOB);

        // Check if today is the tourist's birthday
        if (today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate()) {
            // Assign the birthday promo code
            tourist.birthdayPromoCode = {
                code,
                discount,
                validFrom: today,
                validUntil: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7), // Valid for 7 days
                status: 'active',
            };

            await tourist.save();

            res.status(200).json({ message: 'Birthday promo code assigned successfully', birthdayPromoCode: tourist.birthdayPromoCode });
        } else {
            res.status(400).json({ message: 'Today is not the tourist\'s birthday' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error assigning birthday promo code', error: error.message });
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

module.exports = { createAdmin, updatePassword, deleteAccount, sendOTPadmin, createTourismGovernor, getPendingUsers, createPromoCode,getPromoCodes,assignBirthdayPromoCode,createGlobalPromoCode,createGlobalPromoCode,getGlobalPromoCodes,updateGlobalPromoCode,deleteGlobalPromoCode,validateGlobalPromoCodes,};