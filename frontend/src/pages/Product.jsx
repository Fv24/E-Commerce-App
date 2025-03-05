import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';

const Product = () => {
  const { productId } = useParams();
  const { currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`http://localhost:5189/api/products/${productId}`);
        setProductData(response.data);
        setImage(response.data.image);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProductData();
  }, [productId]);


  if (!productData) {
    return <div className="text-center py-10">Loading product...</div>;
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Information */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row justify-end">
          <div className="w-full sm:w-[60%]">
            <img className="w-full h-auto" src={`/Images/${image}`} alt={productData.name} />
          </div>
        </div>

        {/* Main Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img className="w-3 5" src="/Images/star.png" alt="" />
            <img className="w-3 5" src="/Images/star.png" alt="" />
            <img className="w-3 5" src="/Images/star.png" alt="" />
            <img className="w-3 5" src="/Images/star.png" alt="" />
            <img className="w-3 5" src="/Images/starnull.png" alt="" />
            <p className="pl-2">(22)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

          {/* Color Selection */}
          {productData.colors && productData.colors.trim() !== '' && (
            <div className="flex flex-col gap-4 my-8">
              <p>Select Color</p>
              <div className="flex gap-2">
                {productData.colors.split(',').map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setColor(item.trim())}
                    className={`border py-2 px-4 bg-gray-100 ${item.trim() === color ? 'border-orange-500' : ''}`}>
                    {item.trim()}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={() => addToCart(productData.id, color)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700">
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available for this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description and Reviews */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
        <p>DécorEase is an innovative e-commerce platform designed to simplify the way users shop for home decorations and furniture.</p>
        <p>The platform features detailed product descriptions, high-resolution images, and an intuitive filtering system to help users find the perfect pieces for their space.</p>
      </div>

      {/* Related Products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  );
};

export default Product;
