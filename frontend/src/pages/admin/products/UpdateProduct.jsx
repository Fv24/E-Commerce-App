import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateProduct = () => {
  const {id} = useParams(); // Merr ID-në e produktit nga URL
  const navigate = useNavigate();
  const {products, setProducts } = useContext(ShopContext);
  //Data
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [price, setPrice] = useState('');
  const [colors, setColors] = useState('');
  const [image, setImage] = useState('');
  const [bestSeller, setBestSeller] = useState(false);

  useEffect(() => {
    const product = products.find((product) => product.id === parseInt(id));
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setCategory(product.category);
      setSubCategory(product.subCategory);
      setPrice(product.price);
      setColors(product.colors);
      setImage(product.image);
      setBestSeller(product.bestSeller);
    }
  }, [id,products]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      name,
      description,
      category,
      subCategory,
      price,
      colors,
      image,
      bestSeller,
    };

    try {
      const response = await axios.put(`http://localhost:5189/api/products/${id}`, updatedProduct);
      if (response.status === 200) {
        toast.success('Product updated successfully!');
        // Update the state with the new product data
        setProducts(products.map(product => product.id === parseInt(id) ? { ...product, ...updatedProduct } : product));
        navigate('/dashboard/listProducts'); // Redirect to the product list page
      }
    } catch (error) {
      toast.error('Failed to update product.');
    }
  };

  const onCancelHandler = () => {
    navigate('/dashboard/listProducts'); // Redirect to the product list
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3 px-4 sm:px-10 md:px-20 lg:px-32">
        
        <div className="w-full">
          <p className="mb-2">Product Image</p>
          <input
            className="w-full max-w-[500px] px-3 py-2"
            type="file"
            onChange={e => setImage(e.target.files[0].name)} // Only file name
          />
        </div>

        {image && <img className="w-20" src={`/Images/${image}`} alt="Product Preview" />}

        <div className="w-full">
          <p className="mb-2">Product Name:</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Type here"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2">Product Description:</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full max-w-[500px] px-3 py-2"
            placeholder="Write description"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-8 w-full">
          <div className="w-full sm:w-1/5">
            <p className="mb-2">Product Category:</p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full max-w-[300px] px-3 py-2"
            >
              <option value="">Select Category</option>
              <option value="Furniture">FURNITURE</option>
              <option value="Accessories">ACCESSORIES</option>
              <option value="Lighting">LIGHTING</option>
              <option value="Decorative Art">DECORATIVE ART</option>
            </select>
          </div>

          <div className="w-full sm:w-1/5">
            <p className="mb-2">Sub Category:</p>
            <select
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
              className="w-full max-w-[300px] px-3 py-2"
            >
              <option value="">Select SubCategory</option>
              <option value="Living Room">Living Room</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Dinning Room">Dinning Room</option>
              <option value="Home Decor">Home Decor</option>
              <option value="Art">Art</option>
              <option value="Mirrors">Mirrors</option>
            </select>
          </div>

          <div className="w-full sm:w-1/5">
            <p className="mb-2">Product Price:</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full max-w-[300px] px-3 py-2 sm:w-[120px]"
              type="number"
              placeholder="25"
              required
            />
          </div>

        </div>

        <div className="w-full">
          <p className="mb-2">Product Colors:</p>
          <input
            onChange={(e) => setColors(e.target.value)}
            value={colors}
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Enter colors (comma separated)"
            required
          />
        </div>

        <div className="flex gap-2 mt-2">
          <input onChange={() => setBestSeller((prev) => !prev)} checked={bestSeller} type="checkbox" id="bestseller" />
          <label className="cursor-pointer" htmlFor="bestseller">
            Add to best seller
          </label>
        </div>

        <div className="flex gap-4 mt-4 flex-wrap justify-center sm:justify-start">
          <button type="submit" className="w-28 py-3 bg-blue-500 text-white">
            UPDATE
          </button>
          <button type="button" onClick={onCancelHandler} className="w-28 py-3 bg-red-500 text-white">
            CANCEL
          </button>
        </div>
        
    </form>
  );
};

export default UpdateProduct;
