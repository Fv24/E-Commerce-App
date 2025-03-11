import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const {token, setToken, navigate } = useContext(ShopContext);
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  //Register and Login
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const registerResponse = await axios.post("http://localhost:5189/api/Auth/register", {
          name, email, password
        });
  
        if (registerResponse.data.success) {
          toast.success(registerResponse.data.message);
  
          // Pas regjistrimit, bëjmë login automatikisht
          const loginResponse = await axios.post("http://localhost:5189/api/Auth/login", { 
            email, password 
          });
  
          if (loginResponse.data.success && loginResponse.data.token) {
            const token = loginResponse.data.token;
            setToken(token);
            localStorage.setItem('token', token);
            // toast.success("Logged in successfully");
            navigate('/'); // Navigo në home
          } else {
            toast.error("Login after registration failed");
          }
        } else {
          toast.error(registerResponse.data.message || "Registration failed");
        }
      } else {
        const response = await axios.post("http://localhost:5189/api/Auth/login", {email, password});
  
        if (response.data.success && response.data.token) {
          const token = response.data.token;
          setToken(token);
          localStorage.setItem('token', token);
          toast.success(response.data.message);
          navigate('/'); // Navigo në home
        } else {
          toast.error(response.data.message || "Login failed");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
  
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken); 
      navigate('/'); //Navigo ne home pas login dhe register
    } else {
      navigate('/login'); //Nese nuk ka token, navigo ne login page
    }
  }, [token,setToken,navigate]);


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      {currentState === 'Login' ? '' : <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />}
      <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
      <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Forgot your password?</p>
        {
          currentState === 'Login'
            ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
            : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
        }
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
    </form>
  )
}

export default Login
