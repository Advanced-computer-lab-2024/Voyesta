import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductSalesView({userType}) {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
//   const [userType, setUserType] = useState('');

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  };



  useEffect(() => {
    axios.get(`http://localhost:3000/api/${userType}/getProductsSales`, getAuthHeaders())
      .then(res => {
        setSalesData(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response ? err.response.data.message : err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="product-sales-view">
      <h2 className="text-lg font-bold text-center p-10">Product Sales View</h2>
      <table className="min-w-full bg-gray-100 shadow rounded">
        <thead>
          <tr>
            <th className="py-2">Product Name</th>
            <th className="py-2">Available Quantity</th>
            <th className="py-2">Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map(({ product, totalSales }) => (
            <tr key={product._id} className='text-center'>
              <td className="py-2">{product.name}</td>
              <td className="py-2">{product.available_quantity}</td>
              <td className="py-2">{totalSales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductSalesView;