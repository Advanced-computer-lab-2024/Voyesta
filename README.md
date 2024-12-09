# Voyesta
Voyesta is a comprehensive platform designed to enhance the travel experience by providing detailed information about various activities, historical places, and museums.

## Table of Contents

1. [🚀 Motivation](#-motivation)
2. [🧱 Build Status](#-build-status)
3. [🎨 Code Style](#-code-style)
4. [📸 Screenshots](#-screenshots)
5. [⚒️ Tech and Framework used](#%EF%B8%8F-tech-and-framework-used)
6. [🔥 Features](#-features)
7. [📚 API Reference](#-api-reference)
8. [💻 Code Examples](#-code-examples)
9. [🪛 Installation & API reference](#-installation--api-reference)
10. [🧪 Tests](#-tests)
11. [🧑🏻‍🏫 How to Use](#-how-to-use)
12. [🤝 Contributing](#-contributing)
13. [🫡 Credits](#-credits)
14. [📜 License](#-license)

## 🚀 Motivation
It also includes features: 
- Like promo codes
- User authentication
- Booking for flights, transportations and hotels
- Buying products.
### All those features are done with online and offline services.

## 🧱 Build Status

[![Build Status](https://github.com/yourusername/voyesta/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/voyesta/actions)
[![Coverage Status](https://coveralls.io/repos/github/yourusername/voyesta/badge.svg?branch=main)](https://coveralls.io/github/yourusername/voyesta?branch=main)
[![Dependencies Status](https://david-dm.org/yourusername/voyesta/status.svg)](https://david-dm.org/yourusername/voyesta)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yourusername/voyesta/blob/main/LICENSE)

- This project is under development and should not be used in a production setting.
- Check **Issues** for a list of all the reported issues.
- More automated tests should be added in the future.
- More documentation should be added.

## 🎨 Code Style
This project uses the *StandardJS* code style for consistency and readability.

## 📸 Screenshots
![Screenshot 1](screenshots/screenshot1.jpg)
![Screenshot 2](screenshots/screenshot2.jpg)
![Screenshot 3](screenshots/screenshot3.jpg)
![Screenshot 3](screenshots/screenshot4.jpg)
## ⚒️ Tech/Framework used

- [NodeJs](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [ReactJs](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [NodeMailer](https://nodemailer.com/about/)
- [JsonWebToken](https://jwt.io/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Postman](https://www.postman.com/)
- [TailwindCSS](https://tailwindcss.com/)

## 🔥 Features
- User authentication and profile management
- Promo code management
- Activity and itinerary booking
- Revenue tracking for tour guides and advertisers
- Bookmarking of activities and itineraries
- Product purchases
- Flight, transportation, and hotel booking
- Offline access
- Notifications
- Reviews and ratings
- Multi-language support
- Responsive design

## 📚 API Reference

> All endpoints are prefixed by `/api`

### User Authentication
- **Register a new user**
  - `POST /api/auth/register`
  - Request Body: `{ "username": "john_doe", "email": "john@example.com", "password": "password123" }`
  - Response: `{ "message": "User registered successfully", "user": { ... } }`

- **Login a user**
  - `POST /api/auth/login`
  - Request Body: `{ "email": "john@example.com", "password": "password123" }`
  - Response: `{ "message": "User logged in successfully", "token": "..." }`

### Promo Code Management
- **Apply a promo code**
  - `POST /api/tourist/redeemPromoCode`
  - Request Body: `{ "code": "PROMO2023" }`
  - Response: `{ "message": "Promo code applied", "discount": 10 }`

### Activity Booking
- **Book an activity**
  - `POST /api/activities/:activityId/book`
  - Request Body: `{ "date": "2023-12-25", "numberOfPeople": 2 }`
  - Response: `{ "message": "Activity booked successfully", "booking": { ... } }`

### Product Purchases
- **Purchase a product**
  - `POST /api/products/:productId/purchase`
  - Request Body: `{ "quantity": 1, "address": { ... } }`
  - Response: `{ "message": "Product purchased successfully", "order": { ... } }`

### Reviews and Ratings
- **Add a review for a product**
  - `POST /api/products/:productId/reviews`
  - Request Body: `{ "rating": 5, "comment": "Great product!" }`
  - Response: `{ "message": "Review added successfully", "review": { ... } }`

### User Profile
- **Get user profile**
  - `GET /api/users/profile`
  - Headers: `{ "Authorization": "Bearer <token>" }`
  - Response: `{ "user": { ... } }`

- **Update user profile**
  - `PUT /api/users/profile`
  - Request Body: `{ "username": "john_doe_updated", "email": "john_updated@example.com" }`
  - Headers: `{ "Authorization": "Bearer <token>" }`
  - Response: `{ "message": "Profile updated successfully", "user": { ... } }`

## 💻 Code Examples

### User Authentication

**Register a new user:**
```javascript
import axios from 'axios';

const registerUser = async (userData) => {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/register', userData);
    console.log('User registered:', response.data);
  } catch (error) {
    console.error('Error registering user:', error);
  }
};

const userData = {
  username: 'john_doe',
  email: 'john@example.com',
  password: 'password123'
};

registerUser(userData);
```

## 🪛 Installation
To get started with Voyesta, follow these steps:

1. Clone the repository:
    sh
    git clone https://github.com/Advanced-computer-lab-2024/Voyesta.git
    

2. Navigate to the project directory:
    sh
    cd VOYESTA
    npm install
    
    
3. Set up environment variables:
    - Create a .env file in the backend directory and add the necessary environment variables:
    * port = 3000
    * Mongo_URI = String from MongoDB that connected to ur dataBase
    * CLOUDINARY_API_SECRET= SecretID that gives access for Cloud storage
    * CLOUDINARY_CLOUD_NAME= The name of Cloud storage
    * CLOUDINARY_API_KEY= keyID of Cloud storage
    * AMADEUS_CLIENT_ID=ID of AMADEUS
    * AMADEUS_CLIENT_SECRET=Secret Key of AMADEUS
    * STRIPE_SECRET_KEY= Key for the api that handels payments
4. Start the development servers:
    - Frontend:
        sh
        cd VOYESTA
        npm run dev
        
## 🧪 Tests
We use Postman to manually test our APIs

## 🧑🏻‍🏫 How to use
Make sure to follow [Installation](#-installation) and [Usage](#-usage) steps

## Usage
Once the servers are running, you can access the application at http://localhost:5173 for the frontend and http://localhost:3000/api for the backend API.

## 🤝 Contributing
We welcome contributions to Voyesta! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch:
    sh
    git checkout -b feature/your-feature-name
    
3. Make your changes and commit them:
    sh
    git commit -m "Add your message here"
    
4. Push to the branch:
    sh
    git push origin feature/your-feature-name
    
5. Create a pull request.

## 🫡 Credits
- https://www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA
- https://www.youtube.com/channel/UCW5YeuERMmlnqo4oq8vwUpg   
- https://flowbite.com/     
- https://stripe.com/

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
