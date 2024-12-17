import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets'; // Adjust the import path as necessary
import ProductLabel from './ProductLabel';
import { FaCartPlus, FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import Snackbar from '@mui/material/Snackbar'; // Import Snackbar for notifications
import CircularProgress from '@mui/material/CircularProgress';

function ProductCard({ fetchProducts, oldProduct, onEdit, convertedPrice, targetCurrency }) {
  const [product, setProduct] = useState(oldProduct);
  const [averageRating, setAverageRating] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [userType, setUserType] = useState('');
  const [userId, setUserId] = useState('');

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  useEffect(() => {
    axios.get('http://localhost:3000/api/user', getAuthHeaders())
      .then(res => {
        console.log(res.data.user);
        setUserType(res.data.user.type);
        setUserId(res.data.user.id);
      })
      .catch(err => console.log(err));
  }, []);

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

<<<<<<< HEAD
=======
  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleEditSaveClick = () => {
    console.log(userType);
    const url = `http://localhost:3000/api/${userType}/updateProduct/${product._id}`;
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
          window.location.reload();
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
          window.location.reload();
        } else {
          alert('There was an error adding the product to the wishlist.');
        }
      })
      .catch(err => console.log(err));
  };
  
  const handleRemoveFromWishlist = () => {
    const url = `http://localhost:3000/api/tourist/deleteWish`;
    axios.delete(url, { productId: product._id }, getAuthHeaders())
      .then(res => {
        if (res.status === 200) {
          alert('Product removed from wishlist successfully!');
  
          // Update localStorage
          const updatedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]').filter(id => id !== product._id);
          localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
          window.location.reload();
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
>>>>>>> 6469cc2305d262f78037f8e83186459bbeffad9e
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

  const handleEditSaveClick = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:3000/api/seller/updateProduct/${product._id}`;
      const response = await axios.put(url, product, getAuthHeaders());
      if (response.status === 200) {
        setSuccessMessage('Product updated successfully!');
        fetchProducts(); // Fetch the updated products
        setEditMode(false);
      } else {
        setError('There was an error updating the product.');
      }
    } catch (err) {
      setError('Failed to update the product.');
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleArchiveToggle = async () => {
    try {
      const url = `http://localhost:3000/api/${userType}/${product.isArchived ? 'unarchiveProduct' : 'archiveProduct'}/${product._id}`;
      const response = await axios.patch(url, {}, getAuthHeaders());
      if (response.status === 200) {
        setProduct({ ...product, isArchived: !product.isArchived });
        setSuccessMessage(`Product ${product.isArchived ? 'unarchived' : 'archived'} successfully!`);
      } else {
        setError('There was an error changing the archive state.');
      }
    } catch (err) {
      setError('Failed to change archive state.');
=======
    if (userType === 'seller') {
      // const isEditable = product.createdBy?._id === userId && product.createdBy?.role === 'seller';
      return (
        <>
          {isEditable && (
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
          )}
        </>
      );
>>>>>>> 6469cc2305d262f78037f8e83186459bbeffad9e
    }
  };

  const handleAddToCart = async () => {
    try {
      const url = `http://localhost:3000/api/tourist/addToCart`;
      const response = await axios.post(url, { productId: product._id, quantity: 1 }, getAuthHeaders());
      if (response.status === 200) {
        setSuccessMessage('Product added to cart successfully!');
      } else {
        setError('There was an error adding the product to the cart.');
      }
    } catch (err) {
      setError('Failed to add product to cart.');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const url = `http://localhost:3000/api/tourist/addToWishlist`;
      const response = await axios.post(url, { productId: product._id }, getAuthHeaders());
      if (response.status === 200) {
        setIsWishlisted(true);
        setSuccessMessage('Product added to wishlist successfully!');
        const updatedWishlist = [...JSON.parse(localStorage.getItem('wishlist') || '[]'), product._id];
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      } else {
        setError('There was an error adding the product to the wishlist.');
      }
    } catch (err) {
      setError('Failed to add product to wishlist.');
    }
  };

  const handleRemoveFromWishlist = async () => {
    try {
      const url = `http://localhost:3000/api/tourist/deleteWish`;
      const response = await axios.post(url, { productId: product._id }, getAuthHeaders());
      if (response.status === 200) {
        setIsWishlisted(false);
        setSuccessMessage('Product removed from wishlist successfully!');
        const updatedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]').filter(id => id !== product._id);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      } else {
        setError('There was an error removing the product from the wishlist.');
      }
    } catch (err) {
      setError('Failed to remove product from wishlist.');
    }
  };

  return (
    <div className='bg-white shadow-md rounded-md p-4 w-80'>
      <div className={`flex justify-between flex-col h-full ${editMode ? 'hidden' : ''}`}>
        {/* Product Details */}
        <div>
          <img src={`${product.picture}`} alt={product.name} className="w-full h-40 object-cover rounded-md" />
          <h2 className="text-lg font-bold mt-2">{product.name}</h2>
          <p className="text-gray-600 mt-1">{product.description}</p>
          <div className="flex items-center mt-2">
            <span className="text-gray-600 mr-2">Price:</span>
            <span className="font-bold">{convertedPrice ? `${convertedPrice.toFixed(2)} ${targetCurrency}` : `${product.price} USD`}</span>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-gray-600 mr-2">Ratings:</span>
            <div className="flex">{renderStars()}</div>
          </div>
          <p className="text-gray-600 mt-2">Available Quantity: {product.available_quantity}</p>
        </div>

        {/* Action Buttons */}
        <div className="relative flex justify-end mt-4">
<<<<<<< HEAD
          {isWishlisted ? (
            <FaHeart onClick={handleRemoveFromWishlist} className="text-red-500 text-2xl cursor-pointer mx-2" />
          ) : (
            <FaRegHeart onClick={handleAddToWishlist} className="text-black text-2xl cursor-pointer mx-2" />
          )}
          <FaCartPlus onClick={handleAddToCart} className="text-black text-2xl cursor-pointer mx-2" />
=======
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
          <div className='h-8'>

          </div>

          <img
            onClick={handleEditSaveClick}
            src={assets.submitIcon}
            className="w-8 h-8 cursor-pointer absolute bottom-2 right-2"
          />
>>>>>>> 6469cc2305d262f78037f8e83186459bbeffad9e
        </div>
      </div>

      {/* Snackbar Messages */}
      <Snackbar open={!!successMessage} message={successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')} />
      <Snackbar open={!!error} message={error} autoHideDuration={6000} onClose={() => setError('')} />
    </div>
  );
}

export default ProductCard;
