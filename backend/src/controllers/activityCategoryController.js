const activityCategoryModel = require('../Models/ActivityCategory');


// create activity category in db 

const createActivityCategory = async(req,res) => {
    const { Name } = req.body;
    try{
        const activityCategory = await activityCategoryModel.create({Name});
        res.status(201).send(activityCategory); // Return the created activity category
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Error creating activity category' });
    }
}

// read activity category from db
const getActivityCategory = async (req, res) => {
    try {
        const activityCategory = await activityCategoryModel.find();
        res.status(200).send(activityCategory);
    }
    catch(e){
        console.error(e); 
        res.status(500).send({ message: 'Error fetching activity categories' });
    }

}

// delete activity category by id from db
const deleteActivityCategoryById = async (req, res) => {
    const { Id } = req.body;
    try {
        const activity = await activityCategoryModel.findByIdAndDelete(Id);
        if (!activity) {
            return res.status(404).send({ message: 'Activity category not found' });
        }else{
            res.status(200).send({ message: 'Activity category deleted successfully' });
        }
    }
    catch(e){
        console.error(e);
        res.status(500).send({ message: 'Error deleting activity category' });
    }
}

//update activity category in db
const updateActivityCategory = async (req, res) => {
    const { Id, Name } = req.body;
    try{
        const activityCategory = await activityCategoryModel.findByIdAndUpdate(Id, { Name }, { new: true });
        if(!activityCategory){
            return res.status(404).send({ message: 'Activity category not found' });
        }
        res.status(200).send(activityCategory);
    }
    catch(e){
        console.error(e);
        res.status(500).send({ message: 'Error updating activity category' });
    }
}


module.exports = {
    createActivityCategory,
    getActivityCategory,
    updateActivityCategory,
    deleteActivityCategoryById
}