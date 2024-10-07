import { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";

function AdvertiserListView(props) {
  const [advertisers, setAdvertisers] = useState([]);
  const [editing, setEditing] = useState({});
  const [editedAdvertiser, setEditedAdvertiser] = useState({});

  // Fetch advertisers
  const fetchAdvertisers = () => {
    const url = props.baseUrl + "/get"; // Update this endpoint according to your API
    axios.get(url)
      .then(res => {
        setAdvertisers(res.data);
      })
      .catch(err => console.log(err));
  };

  // Use effect to fetch advertisers on component mount
  useEffect(() => {
    fetchAdvertisers();
  }, []);

  // Handle edit icon pressed
  const handleEditIcon = (advertiser) => {
    setEditing({ [advertiser._id]: true });
    setEditedAdvertiser(advertiser); // Set the selected advertiser details to be edited
  };

  // Handle edit form submission
  const handleEditSubmit = (e, advertiserId) => {
    e.preventDefault();
    const url = props.baseUrl + "/update"; // Update this endpoint according to your API
    axios.put(url, {
      Id: advertiserId,
      ...editedAdvertiser // Send updated details
    })
      .then(res => {
        console.log(res.data);
        setEditing({});
        fetchAdvertisers(); // Refresh the list after editing
      })
      .catch(err => console.log(err));
  };

  // Handle input changes in edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAdvertiser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
        <h1 className="text-2xl text-gray-600 font-bold mb-3">Advertisers</h1>
        <ul className="text-center">
          {advertisers.map(advertiser => (
            <li key={advertiser._id} className="border-b border-gray-200 last:border-0 p-2">
              {editing[advertiser._id] ? (
                <form onSubmit={(e) => handleEditSubmit(e, advertiser._id)} className="flex flex-col gap-2">
                  <input
                    type="text"
                    name="username"
                    value={editedAdvertiser.username}
                    onChange={handleInputChange}
                    className="border rounded p-1"
                    placeholder="Username"
                  />
                  <input
                    type="email"
                    name="email"
                    value={editedAdvertiser.email}
                    onChange={handleInputChange}
                    className="border rounded p-1"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    name="website"
                    value={editedAdvertiser.website}
                    onChange={handleInputChange}
                    className="border rounded p-1"
                    placeholder="Website"
                  />
                  <input
                    type="text"
                    name="hotline"
                    value={editedAdvertiser.hotline}
                    onChange={handleInputChange}
                    className="border rounded p-1"
                    placeholder="Hotline"
                  />
                  <input
                    type="text"
                    name="companyProfile"
                    value={editedAdvertiser.companyProfile}
                    onChange={handleInputChange}
                    className="border rounded p-1"
                    placeholder="Company Profile"
                  />
                  <input
                    type="text"
                    name="servicesOffered"
                    value={editedAdvertiser.servicesOffered}
                    onChange={handleInputChange}
                    className="border rounded p-1"
                    placeholder="Services Offered"
                  />
                  <button type="submit" className="bg-blue-500 text-white rounded p-1">Save</button>
                </form>
              ) : (
                <div className="flex justify-between text-lg font-medium text-gray-500">
                  <span>{advertiser.username}</span>
                  <span>{advertiser.email}</span>
                  <span>{advertiser.website}</span>
                  <span>{advertiser.hotline}</span>
                  <span>{advertiser.companyProfile}</span>
                  <span>{advertiser.servicesOffered}</span>
                  <div className="flex gap-2">
                    <img onClick={() => handleEditIcon(advertiser)} src={assets.editIcon} className="w-6 h-6 cursor-pointer" />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default AdvertiserListView;
