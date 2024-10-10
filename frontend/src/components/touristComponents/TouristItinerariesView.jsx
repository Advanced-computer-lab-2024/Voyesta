import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactSlider from "react-slider"; // Import the slider component

const Itineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]); // Adjust the initial range as needed
  const [selectedLanguage, setSelectedLanguage] = useState(""); // Selected language
  const [selectedTags, setSelectedTags] = useState([]); // Selected tags
  const [startDate, setStartDate] = useState(""); // Start date
  const [endDate, setEndDate] = useState(""); // End date
  const [errorMsg, setErrorMsg] = useState();
  const [sortOrder, setSortOrder] = useState("");

  const baseUrl = "http://localhost:3000/api/tourist";
  const token = localStorage.getItem("token");

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = () => {
    axios
      .get(`${baseUrl}/getItinerary`, getAuthHeaders())
      .then((res) => {
        setItineraries(res.data);
        setErrorMsg(null); // Clear any error messages
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg("Error fetching itineraries.");
      });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Adjust API call for searching itineraries
    axios
      .get(`${baseUrl}/itinerarySearch`, {
        params: {
          query: e.target.value,
        },
      })
      .then((res) => {
        setItineraries(res.data);
        setErrorMsg(null);
      })
      .catch((error) => {
        setItineraries([]);
        setErrorMsg("No itineraries found.");
      });
  };

  const handlePriceFilter = () => {
    axios
      .get(`${baseUrl}/filterItinerary`, {
        params: {
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          language: selectedLanguage,
          tags: selectedTags,
          startDate: startDate,
          endDate: endDate,
        },
      })
      .then((res) => {
        setItineraries(res.data.data);
      })
      .catch((error) => {
        setErrorMsg("Error fetching filtered itineraries.");
      });
  };

  const handleSortOrderChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);

    const sortedItineraries = [...itineraries].sort((a, b) => {
      if (newSortOrder === "asc") {
        return a.tourPrice - b.tourPrice; // Sort ascending by price
      } else if (newSortOrder === "desc") {
        return b.tourPrice - a.tourPrice; // Sort descending by price
      }
      return 0; // No sorting if no valid order
    });
    setItineraries(sortedItineraries);
  };

  const handleReset = () => {
    setSearchTerm(""); // Clear the search input
    setPriceRange([0, 1000]); // Reset price range to default
    setSelectedLanguage(""); // Reset language selection
    setSelectedTags([]); // Reset tags selection
    setStartDate(""); // Reset start date
    setEndDate(""); // Reset end date
    fetchItineraries(); // Fetch all itineraries again
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Itinerary Management</h1>

      <div className="mb-4 w-1/2 mx-auto flex flex-row gap-2">
        <button className="border px-3 rounded" onClick={handleReset}>Reset</button>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search itineraries by name or tags..."
          className="w-full p-2 border border-gray-400 rounded-lg"
        />
      </div>

      <div className="mb-4 w-1/2 mx-auto text-center">
        <label>Sort by Price:</label>
        <select
          value={sortOrder}
          onChange={handleSortOrderChange}
          className="w-full p-2 border border-gray-400 rounded"
        >
          <option value="" disabled>Select an option</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* Price Range Slider */}
      <div className="mb-4 w-1/2 mx-auto">
        <h2 className="text-lg font-bold mb-2">Price Filter</h2>
        <ReactSlider
          min={0}
          max={1000} // Set your max value as needed
          value={priceRange}
          onChange={(range) => setPriceRange(range)}
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        />
        <div className="flex justify-between mt-2">
          <span>Min: ${priceRange[0]}</span>
          <span>Max: ${priceRange[1]}</span>
        </div>
      </div>

      {/* Language Filter */}
      <div className="mb-4 w-1/2 mx-auto">
        <label htmlFor="language" className="block">Language</label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
        >
          <option value="">All Languages</option>
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
          <option value="french">French</option>
          {/* Add more language options as needed */}
        </select>
      </div>

      {/* Tags Filter */}
      <div className="mb-4 w-1/2 mx-auto">
        <label className="block">Tags</label>
        <input
          type="text"
          placeholder="Add a tag..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value) {
              setSelectedTags([...selectedTags, e.target.value]);
              e.target.value = ""; // Clear input after adding tag
            }
          }}
          className="w-full p-2 border border-gray-400 rounded"
        />
        <div className="flex flex-wrap mt-2">
          {selectedTags.map((tag, index) => (
            <span key={index} className="bg-blue-200 text-blue-800 p-1 rounded mr-2">{tag}
              <button onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))} className="ml-2">x</button>
            </span>
          ))}
        </div>
      </div>

      {/* Date Filter */}
      <div className="mb-4 w-1/2 mx-auto">
        <label htmlFor="startDate" className="block">Start Date</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
        />
      </div>

      <div className="mb-4 w-1/2 mx-auto">
        <label htmlFor="endDate" className="block">End Date</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
        />
      </div>

      <button className="bg-blue-500 text-white rounded px-3 py-2" onClick={handlePriceFilter}>Apply Filters</button>

      {errorMsg && <div className="mt-4 text-red-500">{errorMsg}</div>}

      <div className="flex flex-wrap justify-center">
        {itineraries && itineraries.map((itinerary) => (
          <div key={itinerary._id} className="bg-gray-100 p-4 rounded shadow-md mb-2">
            <h3 className="font-bold">{itinerary.name}</h3>
            <p>{itinerary.description}</p>
            <p>From: {new Date(itinerary.startDate).toLocaleDateString()} To: {new Date(itinerary.endDate).toLocaleDateString()}</p>
            <p>Locations: {Array.isArray(itinerary.locations) ? itinerary.locations.join(', ') : 'No locations available'}</p>
            <p>Price: ${itinerary.tourPrice}</p>
            <p>Language: {itinerary.language}</p>
            <p>Tags: {Array.isArray(itinerary.tags) ? itinerary.tags.join(', ') : 'No tags available'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Itineraries;
