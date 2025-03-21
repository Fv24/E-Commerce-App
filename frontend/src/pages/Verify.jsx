import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const Verify = () => {

    const {navigate, token, setCartItems} = useContext(ShopContext)
    const  [searchParams,setSearchParams] = useSearchParams();

    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')
    const sessionId = searchParams.get('session_id')

    const verifyPayment = async () => {
        try {
    
            if (!token) {
                return null;
            }
    
            const responseStripe = await axios.post('http://localhost:5189/api/Order/VerifyStripePayment', 
                { orderId, sessionId, success },  
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
            if (responseStripe.data.success) {
                setCartItems({}); 
                toast.success("Payment verified successfully!");
                navigate("/orders"); 
            } else {
                navigate("/cart");
                toast.error(responseStripe.data.message);
            }
        } catch (error) {
            toast.error("Error verifying payment.");  
        }
    };

    useEffect(() => {
        if (token) {
            verifyPayment();
        }
    }, [token]);

  return (
    <div>
    </div>
  )
}

export default Verify
