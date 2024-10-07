const { Schema } = require('mongoose');
const museumsHistoricalPlacesModel = require('../Models/MusemsAndHistoricalPlaces');


const create = async (req, res) => {
    const { name,
             description,
             pictures, 
            location:{address , city,country,coordinates:{lat,lng}}, 
            openingHours, 
            ticketPrices:{foreigner,native,student}, 
            tags} = req.body;
    const id = req.user.id; 
    try {
        const placeOfInterest = await museumsHistoricalPlacesModel.create({
            name,
            description,
            pictures,
            location:{address , city,country,coordinates:{lat,lng}},
            openingHours,
            ticketPrices :{foreigner,native,student},
            tags,
            createdBy: id
        });
        res.status(201).json({ message: 'Place of interest created successfully', placeOfInterest });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const get = async (req, res) => {
    const { id } = req.params;
    try {
        const placesOfInterest = await museumsHistoricalPlacesModel.find({ createdBy: id });
        res.status(200).json(placesOfInterest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

// get a place of interest by this governor

// const getPlaceOfInterest = async (req, res) => {
//     const { id } = req.params;
//     const { governor } = '66faceb88b0c920ad6ee3c1a';  // hard coded for now
//     try {
//         const placeOfInterest = await museumsHistoricalPlacesModel.findOne({ _id: id, createdBy: governor });
//         if (!placeOfInterest) {
//             return res.status(404).json({ error: 'Place of interest not found or you do not have access' });
//         }
//         res.status(200).json(placeOfInterest);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }

// };


// update a place of interest by this governor
const update = async (req, res) => {
    const { id } = req.params;
    const governor = req.user.id;
    // const { governor } = '66faceb88b0c920ad6ee3c1a';  // hard coded for now
    const body = req.body;
    try {
        const placeOfInterest = await museumsHistoricalPlacesModel.findOneAndUpdate({ _id:id , createdBy: governor}, body , { new: true });
        if (!placeOfInterest) {
            return res.status(404).json({ error: 'Place of interest not found or you do not have access' });
        }
        res.status(200).json({ message: 'Place of interest updated successfully', placeOfInterest });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

// delete a place of interest by this governor
const remove = async (req, res) => {
    const { id } = req.params;
    const governor = req.user.id;
    try {
        const placeOfInterest = await museumsHistoricalPlacesModel.findOneAndDelete({ _id:id , createdBy: governor });
        if (!placeOfInterest) {
            return res.status(404).json({ error: 'Place of interest not found or you do not have access' });
        }
        res.status(200).json({ message: 'Place of interest deleted successfully', placeOfInterest });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const addTag = async (req, res) => {
    const { id } = req.params;
    const { tags } = req.body;
    const governor = req.user.id;
    try {
        const placeOfInterest = await museumsHistoricalPlacesModel.findOneAndUpdate({ _id: id , createdBy: governor}, { $push :{tags} }, { new: true });
        res.status(200).json({ message: 'Tags added successfully', placeOfInterest });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const search = async (req, res) => {
    const { query } = req.query;
    try {
      const placesOfInterest = await museumsHistoricalPlacesModel.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } }
        ]
      });
      res.status(200).json(placesOfInterest);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

const filterByTag = async (req, res) => {
    const { tag } = req.query;
    try {
        const historicalPlaces = await museumsHistoricalPlacesModel.find({ tags: { $in: [tag] } });
        res.status(200).json(historicalPlaces);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { create, get, update, remove, addTag, search, filterByTag};


