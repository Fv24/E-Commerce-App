import React, { useState } from 'react'
import {Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/admin/Dashboard';
import AddProduct from './pages/admin/products/AddProduct';
import ListOrders from './pages/admin/ListOrders';
import UpdateProduct from './pages/admin/products/UpdateProduct';
import ListProducts from './pages/admin/products/ListProducts';
import PrivateRoute from './components/PrivateRoute';
import UserDetails from './pages/admin/products/UserDetails';


const App = () => {


  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
     <Navbar/>
     <SearchBar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/collection' element={<Collection/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/product/:productId' element={<Product/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/place-order' element={<PlaceOrder/>}/>
        <Route path='/orders' element={<Orders/>}/>

        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
            <Route path="addProduct" element={<AddProduct />} />
            <Route path="listProducts" element={<ListProducts />} />
            <Route path="listorders" element={<ListOrders />} />
            <Route path="updateProduct/:id" element={<UpdateProduct />} />
            <Route path="userDetails" element={<UserDetails/>} />
            
      </Route>
            
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
