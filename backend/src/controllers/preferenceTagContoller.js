const { get } = require('mongoose');
const preferenceTagModel = require('../Models/PreferenceTag');

// Create a new preference tag
createPreferenceTag = async (req, res) => {
    const { Name } = req.body;
    try {
        const preferenceTag = await preferenceTagModel.create({Name});
        res.status(201).send(preferenceTag);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  };
  
  // Get all preference tags
  getPreferenceTags = async (req, res) => {
    try {
      const preferenceTags = await preferenceTagModel.find();
      res.status(200).send(preferenceTags);
    } catch (error) {
      res.status(500).send({ message: "error fetching preference tags" });

    }
  };



  
  
  // Update a preference tag
  updatePreferenceTag = async (req, res) => {
    const {Id, Name} = req.body;
    try {
        const preferenceTag = await preferenceTagModel.findByIdAndUpdate(Id, { Name }, { new: true });
        if (!preferenceTag) 
            res.status(404).send({ message: 'Preference tag not found' });
        else 
            res.status(200).send(preferenceTag);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
  };
  
  // Delete a preference tag
  deletePreferenceTag = async (req, res) => {
    const { Id } = req.body;
    try {
        const preferenceTag = await preferenceTagModel.findByIdAndDelete(Id);
        if(!preferenceTag)
            res.status(404).send({ message: 'Preference tag not found' });
        else
        res.status(200).send({ message: 'Preference tag deleted successfully' });
    } catch (error) {
        console.log(error);
      res.status(500).send({ message: 'Error deleting preference tag' });

    }
  };


module.exports = {
    createPreferenceTag,
    getPreferenceTags,
    updatePreferenceTag,
    deletePreferenceTag,
}
