const otpModel = require('../Models/otp');
const adminModel = require('../Models/Admin');
const touristModel = require('../Models/Tourist');
const sellerModel = require('../Models/Seller');
const tourGuideModel = require('../Models/Tour Guide');
const adververtiserModel = require('../Models/Advertiser');
// do the same for tourism governor


const cleanupExpiredOTPs = async () => {
    try {
        // Find all expired OTPs
        const expiredOTPs = await otpModel.find({ createdAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) } });

        // Remove OTPs from all relevant collections
        for (const otpRecord of expiredOTPs) {
            await adminModel.updateOne({ email: otpRecord.email }, { $unset: { otp: 1 } });
            await touristModel.updateOne({ email: otpRecord.email }, { $unset: { otp: 1 } });
            await sellerModel.updateOne({ email: otpRecord.email }, { $unset: { otp: 1 } });
            await tourGuideModel.updateOne({ email: otpRecord.email }, { $unset: { otp: 1 } });
            await advertiserModel.updateOne({ email: otpRecord.email }, { $unset: { otp: 1 } });
            // do the same for tourism governor
        }

        // Remove expired OTPs from the OTP collection
        await otpModel.deleteMany({ createdAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) } });

        console.log('Expired OTPs cleaned up successfully');
    } catch (error) {
        console.error('Error cleaning up expired OTPs:', error);
    }
};