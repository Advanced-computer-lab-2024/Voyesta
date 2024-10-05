import {useState, useEffect} from 'react';
import axios from 'axios';

function CreatePlacesOfInterest(probs) {
    const [title, setName] = useState("");
    const [description, setDescription] = useState("");
    const [pictures, setPictures] = useState([]);
    const [location, setLocation] = useState("");
    const [openingHours, setOpeningHours] = useState("");
    const [ticketPrices, setTicketPrices] = useState("");
    const [message, setMessage] = useState(null);

    const handleCreatePlaceOfInterest = () => {
        const url = probs.baseUrl + "/createPlaceOfInterest";
        axios.post(url)
        .catch(err => console.log(err));
    }

    return (
        <form onSubmit={handleCreatePlaceOfInterest} className="flex flex-col gap-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
                    required
                />
            </div>

            <div>
                <label htmlFor="pictures" className="block text-sm font-medium text-gray-700">
                    Pictures
                </label>
                <input
                    type="file"
                    id="pictures"
                    value={pictures}
                    onChange={(e) => setPictures(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
                    required
                />
            </div>

            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                </label>
                <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
                    required
                />
            </div>

            <div>
                <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700">
                    Opening Hours
                </label>
                <input
                    type="text"
                    id="openingHours"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
                    required
                />
            </div>
            </form>
    );
}

export default CreatePlacesOfInterest;

    
    

