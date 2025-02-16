import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {useNavigate } from 'react-router-dom';  

const AddProduct = () => {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(""); 
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [colors, setColors] = useState("");
  const [bestSeller, setBestSeller] = useState(false);

  const navigate = useNavigate(); 
  
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        name,
        description,
        price,
        image,
        category,
        subCategory,
        colors,
        bestSeller
      };

      const response = await axios.post("http://localhost:5189/api/products", productData, {
        headers: { "Content-Type": "application/json" },
      });
      

      if (response.data) {
        toast.success("Product added successfully!");
        setName("");
        setDescription("");
        setPrice("");
        setImage("");
        setCategory("");
        setSubCategory("");
        setColors("");
        setBestSeller(false);

      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add product.");
    }
  };

  const onCancelHandler = () => {
    navigate('/dashboard'); // Now it will navigate correctly
  
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3 ml-20">
      <div className="w-full">
        <p className="mb-2">Product Image</p>
        <input
          className="w-full max-w-[500px] px-3 py-2"
          type="file"
          onChange={e => setImage(e.target.files[0].name)} // Only file name
          required />
      </div>

      {image && <img className="w-20" src={`/Images/${image}`} alt="Product Preview" />}

      <div className="w-full">
        <p className="mb-2">Product Name:</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type product name"
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

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-3.4">
        <div>
          <p className="mb-2">Product Category:</p>
          <select onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2">
            <option value="">Select Category</option>
            <option value="Furniture">FURNITURE</option>
            <option value="Accessories">ACCESSORIES</option>
            <option value="Lighting">LIGHTING</option>
            <option value="Decorative Art">DECORATIVE ART</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Subcategory:</p>
          <select onChange={(e) => setSubCategory(e.target.value)} className="w-full px-3 py-2">
            <option value="">Select Subcategory</option>
            <option value="Living Room">Living Room</option>
            <option value="Bedroom">Bedroom</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Dinning Room">Dinning Room</option>
            <option value="Home Decor">Home Decor</option>
            <option value="Art">Art</option>
            <option value="Mirrors">Mirrors</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price:</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
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

      <div className="flex gap-4 mt-4">
      <button type="submit" className="w-28 py-3 mt-4 bg-green-700 text-white">
        ADD
      </button>
      <button type="button" onClick={onCancelHandler} className="w-28 py-3 mt-4 bg-red-500 text-white">
          CANCEL
        </button>
      </div>

     
    </form>
  );
};

export default AddProduct;
