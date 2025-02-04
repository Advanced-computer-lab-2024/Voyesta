const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const upload = require('../middleware/upload');
const TourGuide = require('../Models/Tour Guide');
const Seller = require('../Models/Seller');
const Advertiser = require('../Models/Advertiser');
const Product = require('../Models/Product');
dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Upload failed', error: err });
        }

        try {
            const result = await cloudinary.uploader.upload_stream(async (error, result) =>  {
                if (error) return res.status(400).json({ message: 'Cloudinary upload failed', error });

                const imageUrl = result.secure_url;
            
                if (req.user.type === 'tourGuide') {
                    await TourGuide.findByIdAndUpdate(req.user.id, { profilePicture: imageUrl });
                }
                if (req.user.type === 'seller') {
                    await Seller.findByIdAndUpdate(req.user.id, { profilePicture: imageUrl });
                }
                if (req.user.type === 'advertiser') {
                    await Advertiser.findByIdAndUpdate(req.user.id, { profilePicture: imageUrl });
                }

                res.status(200).json({ message: "File uploaded successfully!", url: imageUrl });
            }).end(req.files['picture'][0].buffer);
        } catch (error) {
            res.status(400).json({ message: 'Upload failed', error });
        }
    });
};

const uploadId = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Upload failed', error: err });
        }

        try {

            const stream = cloudinary.uploader.upload_stream(
                {format: 'png'},
                async (error, result) => {
                    if (error) {
                        return res.status(400).json({ message: 'Cloudinary upload failed', error });
                    }

                    const pdfUrl = result.secure_url;
                    
                    // Update the user's document URL in the database
                    if (req.user.type === 'tourGuide') {
                        await TourGuide.findByIdAndUpdate(req.user.id, { personalId: pdfUrl });
                    }if (req.user.type === 'seller') {
                        await Seller.findByIdAndUpdate(req.user.id, { personalId: pdfUrl });
                    }if (req.user.type === 'advertiser') {
                        await Advertiser.findByIdAndUpdate(req.user.id, { personalId: pdfUrl });
                    }

                    res.status(200).json({ message: "ID uploaded successfully as PDF!", url: pdfUrl });
                }
            );

            // Send the buffer to Cloudinary
            stream.end(req.files['idDocument'][0].buffer);
        } catch (error) {
            res.status(400).json({ message: 'Upload failed', error });
        }
    });
};

const uploadAdditionalDocument = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Upload failed', error: err });
        }

        try {
            const result = await cloudinary.uploader.upload_stream(
                {format: 'png'},
                async (error, result) =>  {
                if (error) return res.status(400).json({ message: 'Cloudinary upload failed', error });

                // const imageUrl = result.secure_url;
                const imageUrl = result.secure_url;

                
                if (req.user.type === 'tourGuide') {
                    await TourGuide.findByIdAndUpdate(req.user.id, { additionalDocument: imageUrl });
                }
                if (req.user.type === 'seller') {
                    await Seller.findByIdAndUpdate(req.user.id, { additionalDocument: imageUrl });
                }
                if (req.user.type === 'advertiser') {
                    await Advertiser.findByIdAndUpdate(req.user.id, { additionalDocument: imageUrl });
                }

                res.status(200).json({ message: "File uploaded successfully!", url: imageUrl });
            }).end(req.files['additionalDocument'][0].buffer);
        } catch (error) {
            res.status(400).json({ message: 'Upload failed', error });
        }
    });
};

const getDocument = async (req, res) => {
    const publicId = req.params.public_id;

    try {
        // Retrieve the resource details based on the public_id
        const result = await cloudinary.api.resource(publicId, { resource_type: "raw" });
        res.status(200).json({ url: result.secure_url });
    } catch (error) {
        res.status(400).json({ message: 'Failed to retrieve document', error });
    }
};

// backend/src/controllers/cloudinaryController.js

const uploadProductImage = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Upload failed', error: err });
        }

        try {
            // Upload to cloudinary
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'products' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                
                uploadStream.end(req.files['picture'][0].buffer);
            });

            // Update product with image URL
            const productId = req.params.productId;
            await Product.findByIdAndUpdate(productId, {
                picture: result.secure_url
            });

            res.status(200).json({
                success: true,
                message: "Product image uploaded successfully!",
                url: result.secure_url
            });

        } catch (error) {
            res.status(400).json({ 
                success: false,
                message: 'Upload failed', 
                error: error.message 
            });
        }
    });
};

module.exports = {
    uploadImage,
    uploadId,
    uploadAdditionalDocument,
    getDocument,
    uploadProductImage
};
