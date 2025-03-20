import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { ShopContext } from '../../../context/ShopContext';

const ListOrders = () => {
  const { token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }
  
    try {
      const response = await axios.get('http://localhost:5189/api/Order/AllOrders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  const statusHandler = async (event, orderId) => {
    try {
      const newStatus = event.target.value;
  
      const response = await axios.put(
        `http://localhost:5189/api/Order/UpdateStatus/${orderId}`,
        newStatus, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',  
          },
        }
      );
  
      if (response.data.success) {
        toast.success(response.data.message);  
        await fetchAllOrders();  
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error updating status.");
      console.error(error);
    }
  }
  
  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className='ml-10'>
      <h3>Order Page</h3>
      <div>
        {orders.map((order, index) => (
          <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
            <img className='w-16' src='/Images/box.png' alt="" />
            <div>
              <div>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return <p className='py-0.5' key={index}>{item.productName} x {item.quantity} <span> {item.color} </span></p>
                  } else {
                    return <p className='py-0.5' key={index}>{item.productName} x {item.quantity} <span> {item.color} </span> ,</p>
                  }
                })}
              </div>
              {/* Display the full address string */}
              <p className='mt-3 mb-2 font-medium'>{order.address || "No Address Available"}</p>
            </div>
            <div>
              <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
              <p className='mt-3'>Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
            <select onChange={(event) => statusHandler(event, order.id)} value={order.status} className='p-2 font-semibold'>
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListOrders;
