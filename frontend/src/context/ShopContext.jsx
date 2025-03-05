import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]); // Define products state
  const currency = '€';
  const delivery_free = 10;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState({});
 

  const [token,setToken] = useState('')
  const [userRole, setUserRole] = useState(''); 

//Get products from database

  useEffect(() => {
    axios.get('http://localhost:5189/api/products')
      .then(response => {
        setProducts(response.data); // Fetch and set products
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);




  useEffect(() => {
    if (token && !userRole) {
      axios
        .get("http://localhost:5189/api/Auth/detail", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const role = response.data.roles[0];  // Merr rolin nga backend
          setUserRole(role);
          localStorage.setItem('role', role);  // Ruaj rolin në localStorage
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, [token, userRole]);


 

  const addToCart = async (itemId, color) => {
    if (!color) {
      toast.error("Select Product Color");
      return;
    }
  
    let cartData = structuredClone(cartItems);
  
    if (cartData[itemId]) {
      cartData[itemId][color] = (cartData[itemId][color] || 0) + 1; // Update specific color's quantity
    } else {
      cartData[itemId] = { [color]: 1 };
    }
  
    setCartItems(cartData); // Update local state
  
    // Ensure you're sending the correct data
    const productData = products.find((product) => product.id === itemId);
    if (productData) {
      const requestData = {
        productName: productData.name,
        color: color,
        quantity: cartData[itemId][color],
        price: productData.price,
      };
  
      await axios.post("http://localhost:5189/api/Cart", requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product added to cart!");
    }
  };
  
  
  
  

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        totalCount += cartItems[items][item] || 0;
      }
    }
    return totalCount;
  };
  const updateQuantity = async (itemId, color, quantity) => {
    // Create a copy of the cart and update the quantity
    let cartData = structuredClone(cartItems);
    cartData[itemId][color] = quantity;
    setCartItems(cartData); // Update local state
  
    if (token) {
      try {
        const productData = products.find((product) => product.id === itemId);
  
        if (productData) {
          // Send data to update the cart in the backend
          const response = await axios.put(
            'http://localhost:5189/api/Cart',
            {
              itemId,  // Product ID
            color,  // Color
          quantity,  // Quantity
         
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
  
          if (response.data.success) {
            // After updating in the backend, get the updated cart
            await getUserCart(token);
  
            // Update localStorage
            localStorage.setItem('cartItems', JSON.stringify(response.data.cartData));
  
            // Update the context with the latest cart data
            setCartItems(response.data.cartData);
          }
        }
      } catch (error) {
        console.error('Error updating cart:', error);
        toast.error('Something went wrong while updating the cart.');
      }
    }
  };
  
  
  
  const getCartAmount = () => {
  let totalAmount = 0;
  for (const items in cartItems) {
    let itemInfo = products.find((product) => product.id === Number(items)); // Konverto në numër
    if (itemInfo) {
      for (const item in cartItems[items]) {
        totalAmount += itemInfo.price * (cartItems[items][item] || 0);
      }
    }
  }
  return totalAmount;
};


  const getUserCart = async (token) => {
    try {
      const response = await axios.get('http://localhost:5189/api/Cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data.success) {
        setCartItems(response.data.cartData);
        // Ruaj karrocën në localStorage
        localStorage.setItem('cartItems', JSON.stringify(response.data.cartData));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  
 
  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      const storedToken = localStorage.getItem('token');
      console.log("Found token in localStorage:", storedToken);
      setToken(storedToken);
      getUserCart(storedToken);
    }
  
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));  // Set cart from localStorage if available
      console.log("Cart found in localStorage:", storedCart);
    }
  }, []);
  

  useEffect(() => {
    if (cartItems) {
      console.log("Cart data before updating localStorage:", cartItems);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));  // Ruaj karrocën në localStorage
    }
  }, [cartItems]);
  

  useEffect(() => {
    if (token) {
      console.log("Token is set:", token);
      getUserCart(token); // Kontrolloni këtu nëse getUserCart është duke u thirrur siç duhet
    }
  }, [token]);
  
  
  const value = {
    products,
    setProducts,
    currency,
    delivery_free,
    search,
    setSearch,
    showSearch,
    setShowSearch,

    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    setToken,
    token,
    userRole,
    setUserRole,
    setCartItems
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
