const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const upload = require('../middleware/upload');
const TourGuide = require('../Models/Tour Guide');
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
                console.log(imageUrl);
                if (req.user.type === 'tourGuide') {
                    await TourGuide.findByIdAndUpdate(req.user.id, { profilePicture: imageUrl });
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
            // Define the file name with .pdf extension
            // const fileName = `user_${req.user.id}_idDocument_${Date.now()}`;

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

                console.log(imageUrl);
                if (req.user.type === 'tourGuide') {
                    await TourGuide.findByIdAndUpdate(req.user.id, { additionalDocument: imageUrl });
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


module.exports = {
    uploadImage,
    uploadId,
    uploadAdditionalDocument,
    getDocument
};
