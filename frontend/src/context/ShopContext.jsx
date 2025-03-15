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
  const [token, setToken] = useState('')
  const [userRole, setUserRole] = useState(''); 
  const [cartCount, setCartCount] = useState(''); 
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

  //User Details
  useEffect(() => {
    
    if (token && !userRole) {
      axios.get("http://localhost:5189/api/Auth/detail", {
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

  //Add to cart
  const addToCart = async (productId, color) => {
    if (!color) {
      toast.error("Select Product Color");
      return;
    }
  
    let cartData = structuredClone(cartItems);
  
    if (cartData[productId]) {
      cartData[productId][color] = (cartData[productId][color] || 0) + 1;
    } else {
      cartData[productId] = { [color]: 1 };
    }
  
    setCartItems(cartData);
  
    const productData = products.find((product) => product.id === productId);
    if (productData) {
      const requestData = {
        productId: productData.id, // Ensure productId is sent
        productName: productData.name,
        color: color,
        quantity: cartData[productId][color],
        price: productData.price,
      };
  
      try {
        await axios.post("http://localhost:5189/api/Cart", requestData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product added to cart!");
      } catch (error) {
        toast.error("Failed to add product to cart");
        console.error(error);
      }
    }
  };
  
  //Cart Count
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        totalCount += cartItems[items][item] || 0;
      }
    }
    return totalCount;
  };

  //Update Quantity
  const updateQuantity = async (productId, itemId, color, quantity) => {
    console.log("🚀 updateQuantity called with:", { productId, itemId, color, quantity });

    if (!productId || !color || quantity < 1) {
        console.error("❌ Invalid input!");
        return;
    }

    if (!token) {
        console.error("❌ User token is missing!");
        toast.error("Authentication error. Please log in again.");
        return;
    }

    try {
        const response = await axios.put(
            "http://localhost:5189/api/cart/update",
            { ItemId: itemId, ProductId: productId, Color: color, Quantity: quantity },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data) {
            console.log("✅ Cart updated:", response.data);
            toast.success("Cart updated successfully!");


            
            setCartItems((prevCart) => {
              const updatedCart = {
                  ...prevCart,
                  [productId]: {
                      ...prevCart[productId],
                      [color]: quantity
                  }
              };
              
              // ✅ Ensure cart count updates immediately
              setCartCount(getCartCount(updatedCart));
              return updatedCart;
          });

  
       
        }
    } catch (error) {
        console.error("❌ Error updating cart:", error.response ? error.response.data : error.message);
        toast.error("Something went wrong while updating the cart.");
    }
};

  //Get cart amount
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
    setCartItems,
    navigate,
    setToken,
    token,
    userRole,
    setUserRole,
    getCartCount,
    updateQuantity,
    getCartAmount,
    setCartCount,
    cartCount
  
    

  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
