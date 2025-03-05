import React, { useContext } from "react";
import { ShopContext } from "../../../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ListProducts = () => {

  const { products, currency, setProducts } = useContext(ShopContext);
  const navigate = useNavigate();

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5189/api/products/${id}`);
      if (response.status === 200) {
        toast.success("Product deleted successfully!");
        // Remove the deleted product from the state
        setProducts(products.filter((product) => product.id !== id));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product.");
    }
  };

  const goToUpdatePage = (id) => {
    navigate(`/dashboard/updateProduct/${id}`);
  };

  return (
    <>
      <p className="mb-2 ml-10">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm ml-10">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {products.map((item, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center border p-2 ml-10">
            <img src={`/Images/${item.image}`} alt={item.name} className="w-auto h-16 object-cover" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-center">
              <button onClick={() => goToUpdatePage(item.id)} className="bg-blue-500 text-white px-2 py-1 rounded text-sm mb-2 sm:mb-0 sm:mr-2">
                Update
              </button>
              <button className="bg-red-500 text-white px-2 py-1 rounded text-sm" onClick={() => deleteProduct(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListProducts;
