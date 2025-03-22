import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';

const Profile = () => {
    
    const [user, setUser] = useState(null);
    const { token } = useContext(ShopContext)

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
              if (!token) {
                return;
              }
          
              const response = await axios.get("http://localhost:5189/api/Auth/detail", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              setUser(response.data);
            } catch (error) {
              console.error("Error fetching user details:", error);
            }
        };
          
        fetchUserDetails();
    }, [token]);
    
    if (!user) {
        return <p className="text-center">Loading...</p>;
    }

    return (
        <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl p-6 mt-16"> 
            <div className="flex flex-col items-center">
                <img className="w-24 h-24 rounded-full shadow-md" src="/Images/account.png"/>
                <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
            </div>
            <div className="mt-6 text-center">
                <p className="text-gray-700 mt-2">Email: {user.email}</p>
            </div>
        </div>
    );
}

export default Profile
