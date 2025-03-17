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
          const role = response.data.roles[0];  // Get role from backend
          setUserRole(role);
          localStorage.setItem('role', role);  // Save role in local storage
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, [token, userRole]);

  //Get User Cart
  const getUserCart = async (token) => {
    try {
      const response = await axios.get('http://localhost:5189/api/Cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data && response.data.items) {
        setCartItems(response.data.items); 
        localStorage.setItem('cartItems', JSON.stringify(response.data.items)); 
      }
    } catch (error) {
      toast.error("Error while geting cart: " + error.message);
      console.error("Error:", error);
    }
  };

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
      cartData[existingItemIndex].quantity += 1;
    } else {
      cartData.push({
        productId,
        color,
        quantity: 1
      });
    }
  
    cartData = cartData.filter(item => item != null);
  
    setCartItems(cartData);
  
    const productData = products.find(product => product.id === productId);
  
    if (productData) {
      const requestData = {
        productId: productData.id,
        productName: productData.name,
        color: color,
        quantity: 1,
        price: productData.price,
      };
  
      try {
        const response = await axios.post("http://localhost:5189/api/Cart", requestData, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        await getUserCart(token);
  
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
  
  
  
  
  //Update Quantity
  const updateQuantity = async (productId, itemId, color, quantity) => {
  
    if (!productId || !color || quantity < 1) {
      console.error("Invalid input!");
      return;
    }
  
    if (!token) {
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

        setCartItems(response.data.cart);

        setCartCount(getCartCount(response.data.cart));
  
        toast.success(response.data.message); 
      }
    } catch (error) {
      console.error("Error updating cart:", error.response ? error.response.data : error.message);
      toast.error("Something went wrong while updating the cart.");
    }
  };

  //RemoveCartItems
  const removeFromCart = async (productId, color) => {

    if (!productId || !color) {
      toast.error("Invalid item details");
      return;
    }
  
    if (!token) {
      toast.error("User not authenticated");
      return;
    }
  
    try {
      await axios.delete("http://localhost:5189/api/Cart/remove", {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId, color }, 
      });
      setCartItems(prevItems => prevItems.filter(item => !(item.productId === productId && item.color === color)));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item from cart");
      console.error("Error removing item:", error.response ? error.response.data : error.message);
    }
  };

  //GetCart Count
  const getCartCount = () => {
    let totalCount = 0;

    Object.keys(cartItems).forEach(productId => {
      const item = cartItems[productId];
      totalCount += item.quantity || 1; 
    });

    return totalCount;
  };

  //Get cart amount
  const getCartAmount = () => {
    let totalAmount = 0;

    cartItems.forEach(item => {
      const productInfo = products.find(product => product.id === item.productId);
      if (productInfo) {
        totalAmount += productInfo.price * item.quantity;
      }
    });
  
    return totalAmount;
  };
  
 //Token and cart
  useEffect(() => {
    //Get token and cart
    if (!token && localStorage.getItem('token')) {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      getUserCart(storedToken);
    }
  
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));  // Set cart from localStorage if available
   
    }
  }, []);
  
  //Save cart in local storage
  useEffect(() => {
    if (cartItems) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems)); 
    }
  }, [cartItems]);
  
  //Get user cart based on the token (user)
  useEffect(() => {
    if (token) {
      getUserCart(token); 
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
    cartCount,
    removeFromCart
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
