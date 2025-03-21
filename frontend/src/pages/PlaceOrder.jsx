import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const PlaceOrder = () => {

  const [ method, setMethod ] = useState('cod');
  const{ navigate,token,cartItems,setCartItems,getCartAmount,delivery_free,products } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state: '',
    zipcode:'',
    country:'',
    phone:''
  })

  const onChangeHandler = (event) =>{
    const name = event.target.name;
    const value = event.target.value

    setFormData(data => ({...data,[name]:value}))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
  
    try {

      let orderItems = [];

      for (const item of cartItems) {
        if (item.quantity > 0) {

          const productInfo = products.find(product => product.id === item.productId);

          if (productInfo) {
            orderItems.push({
              ProductId: productInfo.id, 
              Quantity: item.quantity,
              Color: item.color,
              ProductName: productInfo.name
            });
          }
        }
      }
  
      let orderData = {
        address: `${formData.firstName} ${formData.lastName}, ${formData.email}, ${formData.street}, ${formData.city}, ${formData.state}, ${formData.zipcode}, ${formData.country}, ${formData.phone}`,
        items: orderItems,
        amount: getCartAmount() + delivery_free,
        paymentMethod: method,
        payment: method !== "cod", // If it's not "cod", set payment to true else false
      };
  
      switch(method){

        case 'cod':
        const response = await axios.post('http://localhost:5189/api/Order/PlaceOrder', orderData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (response.data.success) {
          setCartItems([]);
          setFormData({});
          navigate('/orders');
        } else {
          toast.error(response.data.message);
        }
        break;

        case 'stripe':
          const responseStripe = await axios.post('http://localhost:5189/api/Order/PlaceOrderSTRIPE', orderData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (responseStripe.data.success) {
              const {session_url} = responseStripe.data
              window.location.replace(session_url);
          } else {
            toast.error(response.data.message);
          }
        break;

        default: 
        break;
      }
    } catch (error) {
      console.error('Error during order submission:', error);
      toast.error('An error occurred during order submission.');
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text=2xl my-3'>
            <Title text1={"DELIVERY"} text2={'INFORMATION'}/>
        </div>
        <div className='flex gap-3'> 
            <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='First name' type="text" />
            <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Last name' type="text" />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email}  className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Email' type="email" />
        <input required  onChange={onChangeHandler} name='street' value={formData.street}  className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Street' type="text" />
        <div className='flex gap-3'> 
            <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='City' type="text" />
            <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='State' type="text" />
        </div>
        <div className='flex gap-3'> 
            <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Zip Code' type="number" />
            <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Country' type="text" />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Phone' type="number" />
      </div>

      {/* Right Side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
            <CartTotal/>
        </div>
        <div className='mt-12'>
            <Title text1={'PAYMENT'} text2={'METHOD'}/>
            {/* Payment Method Selection */}
            <div className='flex gap-3 flex-col lg:flex-row'> 
                <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-600' : ''}`}></p>
                  <img className='h-10 mx-4' src='/Images/stripe.png' alt="" />
                </div>
                <div onClick={() => setMethod('paypal')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'paypal' ? 'bg-green-600' : ''}`}></p>
                  <img className='h-10 mx-4' src='/Images/paypal.png' alt="" />
                </div>
                <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-600' : ''}`}></p>
                  <p className='text-gray-500 text-sm font-mediun mx-4'>CASH ON DELIVERY</p>
                </div>
            </div>

            <div className='w-full text-end mt-8'>
                <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
            </div>

        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
