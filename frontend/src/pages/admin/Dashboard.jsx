import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const Dashboard = () => {
  const location = useLocation();

  // Check if the current route is the Dashboard
  const isDashboardRoute = location.pathname === '/dashboard';

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className='w-[18%] min-h-screen border-r-2'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px] items-start'>
          <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l w-full" to="listProducts">
            <img className="w-5 h-5" src='/Images/list.png' alt="" />
            <p className='hidden md:block'>Items</p>
          </NavLink>

          <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l w-full" to="addProduct">
            <img className="w-5 h-5" src='/Images/add.png' alt="" />
            <p className='hidden md:block'>Add Items</p>
          </NavLink>

          <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l w-full" to="listorders">
            <img className="w-5 h-5" src='/Images/orders.png' alt="" />
            <p className='hidden md:block'>Orders</p>
          </NavLink>

          <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l w-full" to="userDetails">
            <img className="w-5 h-5" src='/Images/userDetail.png' alt="" />
            <p className='hidden md:block'>Users</p>
          </NavLink>
        </div>
      </div>

      {/* Right side content area */}
      <div className="dashboard flex-1 relative">
        {/* Conditionally show the background image based on the current route */}
        {isDashboardRoute && (
          <img
            src="/Images/dashImg.jpg" // Update with the correct path
            alt="Dashboard Image"
            className="absolute w-full h-full object-contain opacity-70 z-0" // Reduced opacity for less transparency
          />

        )}

        {/* Overlay to improve text visibility */}
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
