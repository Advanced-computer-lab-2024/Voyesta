import React from 'react';

function ProductCard({ product, onEdit }) {
  return (
    <div className="bg-[#f5e1b4] shadow-md rounded-md p-4 w-80">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
      <h2 className="text-lg font-bold">{product.name}</h2>
      <p className="text-gray-600 ">{product.description}</p>
      <p className="text-gray-600 "><span className='w-1/2'>Price:</span> <span className='w-1/2'>${product.price}</span></p>
      <p className="text-gray-600 "><span className='w-1/2'>Seller:</span> {product.seller}</p>
      <p className="text-gray-600 "><span className='w-1/2'>Ratings:</span> {product.ratings} / 5</p>
      <p className="text-gray-600 "><span className='w-1/2'>Reviews:</span> {product.reviews.length}</p>
      <p className="text-gray-600 "><span className='w-1/2'>Available Quantity:</span> {product.available_quantity}</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={onEdit}
      >
        Edit Product
      </button>
    </div>
  );
}

export default ProductCard;