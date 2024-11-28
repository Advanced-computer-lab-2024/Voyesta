const axios = require('axios');

const getGoogleMapsApiKey = () => {
    return process.env.GOOGLE_MAPS_API_KEY; // Ensure you have this set in your environment variables
};

const getAddressDetails = async (address) => {
    const apiKey = getGoogleMapsApiKey();

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                address,
                key: apiKey
            }
        });

        if (response.data.status !== 'OK') {
            throw new Error('Failed to fetch address details');
        }

        const result = response.data.results[0];
        const formattedAddress = result.formatted_address;
        const city = result.address_components.find(component => component.types.includes('locality'))?.long_name || '';
        const country = result.address_components.find(component => component.types.includes('country'))?.long_name || '';
        const coordinates = {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng
        };

        return { address: formattedAddress, city, country, coordinates };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getAddressDetails
};