import React, { useContext, useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {

  const [visible, setVisible] = useState(false);
  const {setShowSearch, getCartCount, navigate, token, setToken, setCartItems, userRole, setUserRole} = useContext(ShopContext);

  //Displaying dashboard based on role
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      setUserRole(role);
    }
  }, [token]);  
 
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('cart')
    
    setToken('');
    setUserRole('');
    setCartItems([]); 

    setTimeout(() => {
        navigate('/login'); // Redirect user to login page
    }, 100); 
};


  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      {/* //Navbar Pages */}
      <Link to='/'><img src='/Images/logo.png' className="w-36" alt="" /></Link>

      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        {userRole === "Admin" && (
          <NavLink to='/dashboard' className='flex flex-col items-center gap-1'>
            <p>DASHBOARD</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>
        )}
      </ul>
      {/* Navbar search, login, cart */}
      <div className='flex items-center gap-6'>
        <img onClick={() => setShowSearch(true)} src='/Images/search.png' className='w-5 cursor-pointer' alt='' />

        <div className='group relative'>
          <img onClick={() => token ? null : navigate('/login')} className='w-5 cursor-pointer' src='/Images/profile.png' alt='' />
          {/* Dropdown */}
          {token &&
            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
              <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                <p onClick={() => navigate('/profile')} className='cursor-pointer hover:text-black'>My Profile</p>
                <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
              </div>
            </div>}
        </div>

        <Link to='/cart' className='relative'>
          <img src='/Images/shopping-cart.png' className='w-5 min-w-5' alt='' />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
        </Link>

        <img onClick={() => setVisible(true)} src='/Images/menu.png' className='w-5 cursor-pointer sm:hidden' alt="" />
      </div>

      {/* Sidebar menu for small screens */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'} fixed z-50`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img className='h-4 rotate-360' src='/Images/back.png' alt='' />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to='/'>HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to='/collection'>COLLECTION</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to='/about'>ABOUT</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to='/contact'>CONTACT</NavLink>
          {userRole === "Admin" && (
            <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to='/dashboard'>DASHBOARD</NavLink>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
