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
  
    if (products.length === 0) {
      toast.error("Products are still loading, please wait.");
      return;
    }
  
    let cartData = structuredClone(cartItems);
  
    const existingItemIndex = cartData.findIndex(
      item => item.productId === productId && item.color === color
    );
  
    if (existingItemIndex !== -1) {
      // Ensure valid quantity
      cartData[existingItemIndex].quantity = cartData[existingItemIndex].quantity || 0;
      cartData[existingItemIndex].quantity += 1;
    } else {
      cartData.push({
        productId,
        color,
        quantity: 1,  // Ensure quantity is initialized
        // Add other details like product name, price, etc.
      });
    }
  
    // Remove any null or undefined items
    cartData = cartData.filter(item => item != null);
  
    setCartItems(cartData);
  
    const productData = products.find(product => product.id === productId);
    if (productData) {
      const requestData = {
        productId: productData.id,
        productName: productData.name,
        color: color,
        quantity: 1,  // Since it's being added, initialize quantity as 1
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
    } else {
      toast.error("Product not found");
      console.log(`Product with id ${productId} not found in products.`);
    }
  };
  

  
const getCartCount = () => {
  let totalCount = 0;

  // If cartItems is an object, iterate over the keys (productId)
  Object.keys(cartItems).forEach(productId => {
    const item = cartItems[productId];
    totalCount += item.quantity || 1;  // Assuming each item has a 'quantity' field
  });

  return totalCount;
};


  

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
  
        // Përditësoni cartItems me të dhënat e reja të karrocës nga përgjigjja
        setCartItems(response.data.cart);
  
        // Përditësoni cartCount
        setCartCount(getCartCount(response.data.cart));
  
        toast.success(response.data.message);  // Mesazh suksesi për përdoruesin
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

// const fetchCart = async () => {
//   if (!token) return;

//   try {
//       const response = await axios.get("http://localhost:5189/api/cart", {
//           headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data) {
//           console.log("✅ Cart fetched:", response.data);
//           setCartItems(response.data); // Update cart state
//           setCartCount(getCartCount(response.data));
//       }
//   } catch (error) {
//       console.error("❌ Error fetching cart:", error.message);
//   }
// };

// // Fetch cart when user logs in or visits the cart page
// useEffect(() => {
//   fetchCart();
// }, [token]); // Runs when the token (user login state) changes


const getUserCart = async (token) => {
  try {
    const response = await axios.get('http://localhost:5189/api/Cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.items) {
      console.log("Karroca u mor nga backend:", response.data); // Verifiko të dhënat
      setCartItems(response.data.items); // Vendosim items nga backend në state
      localStorage.setItem('cartItems', JSON.stringify(response.data.items)); // Ruajmë në localStorage
    }
  } catch (error) {
    toast.error("Gabim gjatë marrjes së karrocës: " + error.message);
    console.error("❌ Gabim:", error);
  }
};

useEffect(() => {
  console.log("Cart Items u përditësuan:", cartItems); // Kjo do të logojë çdo ndryshim në cartItems
}, [cartItems]);

useEffect(() => {
  const storedCart = localStorage.getItem('cartItems');
  if (storedCart) {
    setCartItems(JSON.parse(storedCart));  // Vendos të dhënat e karrocës nga localStorage
    console.log("Karroca u ngarkua nga localStorage:", storedCart);
  }
}, []);


  
 
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
