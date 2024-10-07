import {useState, useEffect} from 'react';
import axios from 'axios';

function CreatePlacesOfInterest(probs) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [pictures, setPictures] = useState([]);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [openingHours, setOpeningHours] = useState('');
    const [foreigner, setForeigner] = useState(0);
    const [native, setNative] = useState(0);
    const [student, setStudent] = useState(0);
    const [tags, setTags] = useState([]);
    const [message, setMessage] = useState(null);

    const handleCreatePlaceOfInterest = (e) => {
        e.preventDefault();
        const placeOfInterest = {
            name,
            description,
            pictures,
            location: {
                address,
                city,
                country,
                coordinates: {
                    lat,
                    lng
                }
            },
            openingHours,
            ticketPrices: {
                foreigner,
                native,
                student
            },
            tags
        };
        const url = 'http://localhost:3000/api/tourismGoverner/add';
        axios.post(url, placeOfInterest, {
            headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDMzMzYwNDEzNDUxYzc5YmI0NGU4ZCIsInR5cGUiOiJ0b3VyaXNtR292ZXJuZXIiLCJpYXQiOjE3MjgyNjMwMDgsImV4cCI6MTc1NDE4MzAwOH0.qdjnre9S9j4zFhuscE0dnFxTD8KZLX2_r_pg_gXI1UE` }
        }).
        then(res => {
            console.log(res.data);
            console.log(res.headers);
            setMessage(res.data.message);
        })
        .catch(err => console.log(err));
    }

    return (
        <form onSubmit={handleCreatePlaceOfInterest} className="flex flex-col gap-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
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
            {/* <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    location
                </label>
                <input
                    type="text"
                    id="location"
                    value={Location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
                    required
                />
            </div> */}

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                </label>
                <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
                    required
                />
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    city
                </label>
                <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
                    required
                />
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    country
                </label>
                <input
                    type="text"
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
                    required
                />
                <label htmlFor="lat" className="block text-sm font-medium text-gray-700">
                    Latitude
                </label>
                <input
                    type="text"
                    id="lat"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
                    required
                />
                <label htmlFor="lng" className="block text-sm font-medium text-gray-700">
                    Longitude
                </label>
                <input
                    type="text"
                    id="lng"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
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
            <div>
                    <label>Ticket Price for Foreigners:</label>
                    <input
                        type="number"
                        value={foreigner}
                        onChange={(e) => setForeigner(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Ticket Price for Natives:</label>
                    <input
                        type="number"
                        value={native}
                        onChange={(e) => setNative(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Ticket Price for Students:</label>
                    <input
                        type="number"
                        value={student}
                        onChange={(e) => setStudent(e.target.value)}
                        required
                    />
                </div>
                <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    tags
                </label>
                <textarea
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
                    required
                />
            </div>
            
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Create
            </button>

            </form>
        

    );
}

export default CreatePlacesOfInterest;

    
    

