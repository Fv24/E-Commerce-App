import React from 'react'
import Title from '../components/Title'
import NewsLetterBox from '../components/NewsLetterBox';


const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[400px]' src='/Images/contact.jpg' alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>21045 William Station <br /> Suite 250, Washington, USA</p>
          <p className='text-gray-500'>Tel: (000) 122-211 <br /> Email: contact@decorease.com</p>
          <p className='font-semibold text-xl text-gray-600'>Careers at DécorEase</p>
          <p className='text-gray-500'>Learn more about our team and open positions.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>
      <NewsLetterBox/>
    </div>
  );
};

export default Contact
