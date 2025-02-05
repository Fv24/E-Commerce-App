import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {

  const {products} = useContext(ShopContext);
  const [showFilter,setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts] = useState([]);

  useEffect(() => {
    setFilterProducts(products);
  },[])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
        {/* Filter options */}
      <div className='min-w-60'>
          <p onClick={()=>setShowFilter(!showFilter)}  className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
            <img  className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.rightArrow} alt="" />
          </p>

          {/* Category filter */}
          <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden' } sm:block`}>
            <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
              <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                <p className='flex gap-2'>
                  <input className="w-3" type="checkbox" value={'Furniture'}/> FURNITURE
                </p>
                <p className='flex gap-2'>
                  <input className="w-3" type="checkbox" value={'Accessories'}/> ACCESSORIES
                </p>
                <p className='flex gap-2'>
                  <input className="w-3" type="checkbox" value={'Lighting'}/> LIGHTING
                </p>
                <p className='flex gap-2'>
                  <input className="w-3" type="checkbox" value={'Decorativeart'}/> DECORATIVE ART
                </p>
              </div>
          </div>

        {/* Subcategory filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden' } sm:block`}>
            <p className='mb-3 text-sm font-medium'>TYPE</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>

             
              <div className='flex flex-col gap-2'>
                <label className='flex items-center gap-2'>
                  <input className="w-3" type="checkbox" value={'LivingRoom'}/> Living Room
                </label>
                <label className='flex items-center gap-2'>
                  <input className="w-3" type="checkbox" value={'Bedroom'}/> Bedroom
                </label>
                <label className='flex items-center gap-2'>
                  <input className="w-3" type="checkbox" value={'Kitchen'}/> Kitchen
                </label>
                <label className='flex items-center gap-2'>
                  <input className="w-3" type="checkbox" value={'DiningRoom'}/> Dining Room
                </label>
                <label className='flex items-center gap-2'>
                  <input className="w-3" type="checkbox" value={'Homedecor'}/> Home Decor
                </label>
                <label className='flex items-center gap-2'>
                  <input className="w-3" type="checkbox" value={'Art'}/> Art
                </label>
                <label className='flex items-center gap-2'>
                  <input className="w-3" type="checkbox" value={'Mirrors'}/> Mirrors
                </label>
              </div> 

            </div>
          </div>
      </div>

      {/* Right side */}
      <div className='flex-1'>
          <div className='flex justify-between text-base sm:text-2xl mb-4'>
              <Title text1={'ALL'} text2={'COLLECTIONS'}/>
              {/* Product sort */}
              <select className='border-2 border-gray-300 text-sm px-2'>
                  <option value="relevant">Sort by: Relevant</option>
                  <option value="low-high">Sort by: Low to High</option>
                  <option value="high-low">Sorty by: High to Low</option>
              </select>
          </div>
          {/*Map products*/}
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
            {
              filterProducts.map((item,index) => (
                <ProductItem key={index} name={item.name} id={item.id} price={item.price} image={item.image}/>
              ))
            }

          </div>
      </div>
    </div>
  )
}

export default Collection
