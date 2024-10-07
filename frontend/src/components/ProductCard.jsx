import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import AdminProductLabel from './AdminProductLabel';

function ProductCard({ oldProduct, onEdit, userType, userId }) {
  
  // console.log(product);

  const [product, setProduct] = useState(oldProduct);

  // const [productName,  setProductName] = useState(product.name);
  // const [productPrice, setProductPrice] = useState(product.price);
  // const [productDescription, setProductDescription] = useState(product.description);
  // const [productSeller,  setProductSeller] = useState(product.seller);
  // const [productAvailableQuantity , setProductAvailableQuantity] = useState(product.availableQuantity);




  const [averageRating, setAverageRating] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleEditSaveClick = () => {
    // TO DO: implement save logic here
    onEdit(product);
    setEditMode(false);
  };

  useEffect(() => {
    if (product.ratings) {
      const ratings = product.ratings.map((rating) => rating.rating);
      const sum = ratings.reduce((acc, current) => acc + current, 0);
      const average = sum / ratings.length;
      setAverageRating(average.toFixed(0)); // round to 1 decimal place
    }
  }, [oldProduct.ratings]);

  console.log(product);
  console.log(product.createdBy?._id);
  console.log(userId);
  console.log(userType);
  // check if the user is an admin or the seller of the product
  const isEditable = userType === 'admin' || (
    product.createdBy?._id === userId && product.createdBy?.role === 'seller'
  );
  
  return (
  <div className='bg-[#f5e1b4] shadow-md rounded-md p-4 w-80'>
    <div className={`flex justify-between flex-col h-full ${editMode? 'hidden': null}`}>
      <div>
        <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
        <h2 className="text-lg font-bold">{product.name}</h2>
        <p className="text-gray-600 ">{product.description}</p>
        <p className="text-gray-600 "><span className='w-1/2'>Price:</span> <span className='w-1/2'>${product.price}</span></p>
        <p className="text-gray-600 "><span className='w-1/2'>Seller:</span> {product.seller}</p>
        <p className="text-gray-600 "><span className='w-1/2'>Ratings:</span> {averageRating} / 5</p>
        <p className="text-gray-600 "><span className='w-1/2'>Available Quantity:</span> {product.available_quantity}</p>
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
      {/* </div> */}
    </div>

    <div className={`flex justify-between flex-col h-full text-sm ${editMode? null: 'hidden'}`}>
      <div className="edit-mode">
          <AdminProductLabel 
            title="Name" 
            value={product.name}
            setValue={setProduct}
            onChange = {(newVal) => {
              setProduct({...product, name: newVal});
            }}
          />
          <br />
          <AdminProductLabel
            title="Description" 
            value={product.name}
            setValue={setProduct}
            onChange = {(newVal) => {
              setProduct({...product, description: newVal});
            }}
          />
          <br />
          <AdminProductLabel
            title="Price"
            value={product.price}
            setValue={setProduct}
            onChange = {(newVal) => {
              setProduct({...product, price: newVal});
            }}
          />
          <br />
          <AdminProductLabel
            title="Seller"
            value={product.seller}
            setValue={setProduct}
            onChange = {(newVal) => {
              setProduct({...product, seller: newVal});
            }}
          />
          <br />
          <AdminProductLabel
            title="Available Quantity"
            value={product.available_quantity}
            setValue={setProduct}
            onChange = {(newVal) => {
              setProduct({...product, available_quantity: newVal});
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