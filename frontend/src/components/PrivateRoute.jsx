import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const PrivateRoute = ({children}) => {
  
  const {userRole, setUserRole, token } = useContext(ShopContext);  
  const [loading, setLoading] = useState(true);

  //Get user details
  useEffect(() => {
    if (!userRole && token) {
      axios.get("http://localhost:5189/api/Auth/detail", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const role = response.data.roles[0];
          setUserRole(role);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  },[userRole, token, setUserRole]);

  if (loading) {
    return <div>Loading...</div>;  
  }

  if (userRole === "Admin") {
    return children; 
  } else {
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;
