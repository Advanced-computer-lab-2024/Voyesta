import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import ProductLabel from './ProductLabel';
import axios from 'axios';

function ProductCard({ fetchProducts, oldProduct, onEdit, userId, convertedPrice, targetCurrency }) {
  const [product, setProduct] = useState(oldProduct);
  const [averageRating, setAverageRating] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [userType, setUserType] = useState('');

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

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleEditSaveClick = () => {
    onEdit(product);
    setEditMode(false);
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

  useEffect(() => {
    if (product.ratings) {
      if(product.ratings.length === 0){
        setAverageRating(0);
        return;
      }
      const ratings = product.ratings.map((rating) => rating.rating);
      const sum = ratings.reduce((acc, current) => acc + current, 0);
      const average = sum / ratings.length;
      setAverageRating(average.toFixed(0)); // round to 1 decimal place
    }else{
      setAverageRating(0);
    }
  }, [oldProduct.ratings]);

  const isEditable = userType === 'admin' || (
    product.createdBy?._id === userId && product.createdBy?.role === 'seller'
  );

  const canToggleArchive = userType === 'admin' || (userType === 'seller' && product.createdBy._id === userId);

  return (
    <div className='bg-[#f5e1b4] shadow-md rounded-md p-4 w-80'>
      <div className={`flex justify-between flex-col h-full ${editMode ? 'hidden' : null}`}>
        <div>
          <img src={`http://localhost:3000${product.picture}`} alt={product.name} className="w-full h-40 object-cover" />
          <h2 className="text-lg font-bold">{product.name}</h2>
          <p className="text-gray-600 ">{product.description}</p>
          <p className="text-gray-600 "><span className='w-1/2'>Price:</span> <span className='w-1/2'>{convertedPrice ? `${convertedPrice.toFixed(2)} ${targetCurrency}` : `${product.price.toFixed(2)} USD`}</span></p>
          <p className="text-gray-600 "><span className='w-1/2'>Seller:</span> {product.seller}</p>
          <p className="text-gray-600 "><span className='w-1/2'>Ratings:</span> {averageRating} / 5</p>
          <p className="text-gray-600 "><span className='w-1/2'>Available Quantity:</span> {product.available_quantity}</p>
          {canToggleArchive && (
            <div>
              <p className="text-gray-600 "><span className='w-1/2'>Archived:</span> {product.isArchived ? 'Yes' : 'No'}</p>
              <button 
                onClick={handleArchiveToggle} 
                className={`bg-${product.isArchived ? 'green' : 'red'}-500 text-white rounded-md p-2 mt-2`}
              >
                {product.isArchived ? 'Unarchive' : 'Archive'}
              </button>
            </div>
          )}
        </div>
        <div className="relative flex flex-row justify-end">
          <div className='w-6 h-6'>
          </div>
          {isEditable && (
            <img
              onClick={handleEditClick}
              src={assets.editIcon}
              className="w-6 h-6 cursor-pointer absolute buttom-2 right-2"
            />
          )}
        </div>
      </div>

      <div className={`flex justify-between flex-col h-full text-sm ${editMode ? null : 'hidden'}`}>
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
          <div className='w-8 h-8'>
          </div>
          <img
            onClick={handleEditSaveClick}
            src={assets.submitIcon}
            className="w-8 h-8 cursor-pointer absolute buttom-2 right-2"
          />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;