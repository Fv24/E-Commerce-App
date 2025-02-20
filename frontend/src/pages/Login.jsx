import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const {token, setToken,navigate} = useContext(ShopContext);

  const [name,setName] = useState('')
  const [password,setPassword] = useState('')
  const [email,setEmail] = useState('')
  
const onSubmitHandler = async (event) => {
  event.preventDefault();
  try { 
    if (currentState === 'Sign Up') {
      const response = await axios.post("http://localhost:5189/api/Auth/register", { name, email, password });

      if (response.data.success) {
        // Ruaj token dhe përditëso gjendjen
        const token = response.data.token;
        setToken(token); 
        localStorage.setItem('token', token);
        
        toast.success(response.data.message); 

        // Kaloni në Login direkt pas regjistrimit
        setCurrentState('Login');
        navigate('/'); // Pas regjistrimit, navigoni në faqen kryesore
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } else {
      const response = await axios.post("http://localhost:5189/api/Auth/login", { email, password });

      if (response.data.success && response.data.token) {
        // Ruaj token dhe përditëso gjendjen pas login-it
        const token = response.data.token;
        setToken(token); 
        localStorage.setItem('token', token);
        toast.success(response.data.message); 
        navigate('/'); // Pas login-it, navigoni në faqen kryesore
      } else {
        toast.error(response.data.message || "Login failed");
      }
    }
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "An error occurred");
  }
};



  // Kontrollo token dhe navigo pas refresh
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);  // Sigurohu që token është në kontekst
      navigate('/');  // Navigo në faqen kryesore menjëherë pas regjistrimit ose login-it
    } else {
      navigate('/login');  // Nëse nuk ka token, navigo përsëri në login
    }
  }, [token, setToken, navigate]);


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
          <p className='prata-regular text-3xl'>{currentState}</p>
          <hr  className='border-none h-[1.5px] w-8 bg-gray-800'/>
      </div>
      {currentState === 'Login' ? '' : <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required/>}
      <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required/>
      <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required/>
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
