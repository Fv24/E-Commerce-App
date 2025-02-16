import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]); // Define products state
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const currency = '€';
  const delivery_free = 10;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5189/api/products')
      .then(response => {
        setProducts(response.data); // Fetch and set products
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const addToCart = async (itemId, color) => {
    if (!color) {
      toast.error('Select Product Color');
      return;
    }

    let cartData = structuredClone(cartItems);
    

    if (cartData[itemId]) {
      cartData[itemId][color] = (cartData[itemId][color] || 0) + 1;
    } else {
      cartData[itemId] = { [color]: 1 };
    }

    setCartItems(cartData);
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
    let cartData = structuredClone(cartItems);
    cartData[itemId][color] = quantity;
    setCartItems(cartData);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product.id === items);
      if (itemInfo) {
        for (const item in cartItems[items]) {
          totalAmount += itemInfo.price * (cartItems[items][item] || 0);
        }
      }
    }
    return totalAmount;
  };

  const value = {
    products,
    currency,
    delivery_free,
    setProducts,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
