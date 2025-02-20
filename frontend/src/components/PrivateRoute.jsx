import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios"; // Make sure axios is imported

const PrivateRoute = ({ children }) => {
  const { userRole, setUserRole, token } = useContext(ShopContext);  // Make sure `setUserRole` is available
  const [loading, setLoading] = useState(true);  // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    if (!userRole && token) {
      // Nëse roli nuk është ende i vendosur dhe kemi token, e marrim rolin
      axios
        .get("http://localhost:5189/api/Auth/detail", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const role = response.data.roles[0];
          setUserRole(role);  // Vendos rolin në kontekst
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userRole, token, setUserRole]);

  if (loading) {
    return <div>Loading...</div>;  // Trego një mesazh ngarkimi nëse ende nuk kemi të dhëna
  }

  if (userRole === "Admin") {
    return children;  // Render protected routes if user is Admin
  } else {
    return <Navigate to="/" />;  // Redirect to home if not Admin
  }
};

export default PrivateRoute;
