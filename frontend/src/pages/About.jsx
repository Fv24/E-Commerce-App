import React from 'react'
import Title from '../components/Title'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>

    <div className='text-2xl text-center pt-7 border-t'>
      <Title text1={'ABOUT'} text2={'US'}/> 
    </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src='/Images/aboutus.jpg' alt="" />
            <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
                <p className='text-lg md:text-xl text-justify'>Welcome to DécorEase, your go-to destination for stylish home decor and furniture. Our mission is to make decorating your space effortless and enjoyable. Whether you're looking for modern, classic, or minimalist designs, we bring you a curated collection that blends quality, elegance, and affordability.</p>
                <p className='text-lg md:text-xl text-justify'>At DécorEase, we believe that your home should reflect your personality. That is why we offer a seamless shopping experience, from browsing our exclusive collections to secure checkout and reliable delivery. Discover the art of decorating with ease—only at DécorEase!</p>
            </div>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src='/Images/aboutus2.jpg' alt="" />
            <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
                <b className='text-gray-800 text-lg md:text-xl'>Our Mission</b>
                <p className='text-lg md:text-xl text-justify' >At DécorEase, our mission is to transform every house into a home by offering high-quality, stylish, and affordable home decor and furniture. We strive to make interior design accessible to everyone, providing a seamless shopping experience that inspires creativity and personal expression. We are committed to excellence, ensuring that every piece in our collection reflects elegance, durability, and modern aesthetics. DécorEase - Decorating Made Simple.</p>
            </div>
      </div>

        <div className='text-xl py-4'>
            <Title text1={'WHY'} text2={'CHOOSE US'}/>
        </div>

        <div className='flex flex-col md:flex-row text-sm mb-20'>
              <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Quality Assurance:</b>
                    <p className='text-gray-600 text-justify'>At DécorEase, we prioritize quality in every product we offer. From premium materials to meticulous craftsmanship, we ensure durability, style, and customer satisfaction. Your home deserves the best—shop with confidence!</p>
              </div>
              <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Convience:</b>
                    <p className='text-gray-600 text-justify'>At DécorEase, we make home decorating effortless. With a user-friendly shopping experience, secure payments, and reliable delivery, we ensure a smooth journey from browsing to buying. Style your space with ease!</p>
              </div>
              <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Exceptional Customer Service:</b>
                    <p className='text-gray-600 text-justify'>At DécorEase, your satisfaction is our priority. Our dedicated support team is here to assist you every step of the way, ensuring a seamless shopping experience. We value your trust and strive to exceed your expectations with prompt responses, hassle-free returns, and personalized assistance.</p>
              </div>
        </div>
          <NewsLetterBox/>
    </div>
  )
}

export default About

