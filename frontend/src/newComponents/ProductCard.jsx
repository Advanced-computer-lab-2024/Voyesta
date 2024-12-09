

import React, { useState, useEffect } from 'react';


import axios from 'axios';
import { assets } from '../assets/assets'; // Adjust the import path as necessary
import ProductLabel from './ProductLabel';
import { FaCartPlus, FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function ProductCard({ fetchProducts, oldProduct, onEdit, userId, convertedPrice, targetCurrency }) {
  const [product, setProduct] = useState(oldProduct);
  const [averageRating, setAverageRating] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [userType, setUserType] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  };

  useEffect(() => {
    axios.get('http://localhost:3000/api/user', getAuthHeaders())
      .then(res => setUserType(res.data.user.type))
      .catch(err => console.log(err));
  }, []);

  console.log(userType);  
  console.log(userId);

  useEffect(() => {
    if (product.ratings) {
      if (product.ratings.length === 0) {
        setAverageRating(0);
        return;
      }
      const ratings = product.ratings.map((rating) => rating.rating);
      const sum = ratings.reduce((acc, current) => acc + current, 0);
      const average = sum / ratings.length;
      setAverageRating(average.toFixed(1)); // round to 1 decimal place
    } else {
      setAverageRating(0);
    }
  }, [product.ratings]);
  
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(storedWishlist.includes(product._id));
  }, [product._id]);
  

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleEditSaveClick = () => {
    const url = `http://localhost:3000/api/seller/updateProduct/${product._id}`;
    axios.put(url, product, getAuthHeaders())
      .then(res => {
        if (res.status === 200) {
          alert('Product updated successfully!');
          fetchProducts(); // Fetch the updated products
          setEditMode(false);
        } else {
          alert('There was an error updating the product.');
        }
      })
      .catch(err => console.log(err));
  };

  const handleArchiveToggle = () => {
    console.log(userId);
    if (userType === 'admin' || (userType === 'seller' && product.createdBy._id === userId)) {
      const url = `http://localhost:3000/api/${userType}/${product.isArchived ? 'unarchiveProduct' : 'archiveProduct'}/${product._id}`;
      axios.patch(url, {}, getAuthHeaders())
        .then(res => {
          if (res.status === 200) {
            alert(`Product ${product.isArchived ? 'unarchived' : 'archived'} successfully!`);
            setProduct({ ...product, isArchived: !product.isArchived });
          } else {
            alert('There was an error changing the archive state.');
          }
        })
        .catch(err => console.log(err));
    } else {
      alert('You do not have permission to archive this product.');
    }
  };

  const handleAddToCart = () => {
    const url = `http://localhost:3000/api/tourist/addToCart`;
    axios.post(url, { productId: product._id, quantity: 1 }, getAuthHeaders())
      .then(res => {
        if (res.status === 200) {
          alert('Product added to cart successfully!');
        } else {
          alert('There was an error adding the product to the cart.');
        }
      })
      .catch(err => console.log(err));
  };
  const handleAddToWishlist = () => {
    const url = `http://localhost:3000/api/tourist/addToWishlist`;
    axios.post(url, { productId: product._id }, getAuthHeaders())
      .then(res => {
        if (res.status === 200) {
          setIsWishlisted(true);
          alert('Product added to wishlist successfully!');
  
          // Update localStorage
          const updatedWishlist = [...JSON.parse(localStorage.getItem('wishlist') || '[]'), product._id];
          localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        } else {
          alert('There was an error adding the product to the wishlist.');
        }
      })
      .catch(err => console.log(err));
  };
  
  const handleRemoveFromWishlist = () => {
    const url = `http://localhost:3000/api/tourist/deleteWish`;
    axios.post(url, { productId: product._id }, getAuthHeaders())
      .then(res => {
        if (res.status === 200) {
          setIsWishlisted(false);
          alert('Product removed from wishlist successfully!');
  
          // Update localStorage
          const updatedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]').filter(id => id !== product._id);
          localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        } else {
          alert('There was an error removing the product from the wishlist.');
        }
      })
      .catch(err => console.log(err));
  };
  

  const isEditable = userType === 'admin' || (
    product.createdBy?._id === userId && product.createdBy?.role === 'seller'
  );
// setEditMode(true);
  const canToggleArchive = userType === 'admin' || (userType === 'seller' && product.createdBy._id === userId);
  const canBuy = userType === 'tourist';
  const renderStars = () => {
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {Array(fullStars).fill(<FaStar className="text-yellow-500" />)}
        {halfStar && <FaStarHalfAlt className="text-yellow-500" />}
        {Array(emptyStars).fill(<FaRegStar className="text-yellow-500" />)}
      </>
    );
  };


  // / Function to render icons based on userType and edit mode
  const renderIcons = () => {
    if (userType === 'tourist') {
      return (
        <>
          {isWishlisted ? (
            <FaHeart
              onClick={handleRemoveFromWishlist}
              className="text-red-500 text-2xl cursor-pointer mx-2"
            />
          ) : (
            <FaRegHeart
              onClick={handleAddToWishlist}
              className="text-black text-2xl cursor-pointer mx-2"
            />
          )}
          <FaCartPlus
            onClick={handleAddToCart}
            className="text-black text-2xl cursor-pointer mx-2"
          />
        </>
      );
    }

    if (userType === 'seller') {
      //  const isEditable = product.createdBy?._id === userId && product.createdBy?.role === 'seller';
      return (
        <>
          {isEditable || (
            <>
              <img
                onClick={() => setEditMode(true)}
                src={assets.editIcon}
            className="w-6 h-6 cursor-pointer absolute top-3 right-20"
            />

              <button
                onClick={handleArchiveToggle}
                className={`bg-${product.isArchived ? 'green' : 'red'}-500 text-white rounded-md p-2 mt-2`}
              >
                {product.isArchived ? 'Unarchive' : 'Archive'}
              </button>
            </>
          )}
        </>
      );
    }

    if (userType === 'admin') {
      return (
        <>
          <img
            onClick={() => setEditMode(true)}
            src={assets.editIcon}
            className="w-6 h-6 cursor-pointer absolute top-2 left-2"
          />
          <button
            onClick={handleArchiveToggle}
            className={`bg-${product.isArchived ? 'green' : 'red'}-500 text-white rounded-md p-2 mt-2`}
          >
            {product.isArchived ? 'Unarchive' : 'Archive'}
          </button>
        </>
      );
    }

    return null;
  };

  return (
    <div className='bg-white shadow-md rounded-md p-4 w-80'>
      {/* Display Mode */}
      <div className={`flex justify-between flex-col h-full ${editMode ? 'hidden' : ''}`}>
        <div>
          <img src={`${product.picture}`} alt={product.name} className="w-full h-40 object-cover rounded-md" />
          <h2 className="text-lg font-bold mt-2">{product.name}</h2>
          <p className="text-gray-600 mt-1">{product.description}</p>
          <div className="flex items-center mt-2">
            <span className="text-gray-600 mr-2">Price:</span>
            <span className="font-bold">{convertedPrice ? `${convertedPrice.toFixed(2)} ${targetCurrency}` : `${product.price.toFixed(2)} USD`}</span>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-gray-600 mr-2">Ratings:</span>
            <div className="flex">{renderStars()}</div>
          </div>
          <p className="text-gray-600 mt-2">Available Quantity: {product.available_quantity}</p>
        </div>
  
        {/* Render editable options and actions */}
        <div className="relative flex justify-end mt-4">
          {renderIcons()}
        </div>
      </div>
  
      {/* Edit Mode */}
      <div className={`flex justify-between flex-col h-full text-sm ${editMode ? '' : 'hidden'}`}>
        <div className="edit-mode">
          <ProductLabel
            title="Name"
            value={product.name}
            setValue={setProduct}
            onChange={(newVal) => {
              setProduct({ ...product, name: newVal });
            }}
          />
          <br />
          <ProductLabel
            title="Description"
            value={product.description}
            setValue={setProduct}
            onChange={(newVal) => {
              setProduct({ ...product, description: newVal });
            }}
          />
          <br />
          <ProductLabel
            title="Price"
            value={product.price}
            setValue={setProduct}
            onChange={(newVal) => {
              setProduct({ ...product, price: newVal });
            }}
          />
          <br />
          <ProductLabel
            title="Seller"
            value={product.seller}
            setValue={setProduct}
            onChange={(newVal) => {
              setProduct({ ...product, seller: newVal });
            }}
          />
          <br />
          <ProductLabel
            title="Available Quantity"
            value={product.available_quantity}
            setValue={setProduct}
            onChange={(newVal) => {
              setProduct({ ...product, available_quantity: newVal });
            }}
          />
        </div>
        
        <div className="relative flex flex-row justify-end">
          <img
            onClick={handleEditSaveClick}
            src={assets.submitIcon}
            className="w-8 h-8 cursor-pointer absolute bottom-2 right-2"
          />
        </div>
      </div>
    </div>
  );
}  

export default ProductCard;


