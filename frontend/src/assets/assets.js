import logo from './logo.png';
import search from './search.png';
import profile from './profile.png';
import shoppingcart from './shopping-cart.png';
import menu from './menu.png';
import back from './back.png';
import hero from './hero.jpg';
import image1 from './image1.jpg'
import image2 from './image2.jpg'
import image3 from './image3.jpg'
import image4 from './image4.jpeg'
import image5 from './image5.jpg'
import image6 from './image6.jpg'
import image7 from './image7.jpg'
import image8 from './image8.jpg'
import image9 from './image9.jpeg'
import image10 from './image10.jpg'

export const assets = {
    logo,
    search,
    profile,
    shoppingcart,
    menu,
    back,
    hero,
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10
} 

export const products = [
    {
        id:"DECO-001",
        name: "Modern Sofa",
        description: "Modern design meets ultimate comfort",
        price: 500,
        image:[image1],
        category: "Furniture",
        subCategory: "Living Room",
        colors: ["white","gray","blue"],
        date: 17022025,
        bestseller:true
    },
    {
        id:"DECO-002",
        name: "Wooden Vase",
        description: "A beautifully crafted wooden vase, combining natural elegance with timeless design.",
        price: 50,
        image:[image2],
        category: "Accessories",
        subCategory: "Home Decor",
        colors: ["brown","black"],
        date: 18022025,
        bestseller:true
    },
    {
        id:"DECO-003",
        name: "Nightstand",
        description: "Stylish and functional nightstands.",
        price: 280,
        image:[image3],
        category: "Furniture",
        subCategory: "Bedroom",
        colors: ["white","gray"],
        date: 19022025,
        bestseller:false
    },
    {
        id:"DECO-004",
        name: "Modern Kitchen",
        description: "Sleek and functional, a modern kitchen designed for style, efficiency, and seamless cooking experiences.",
        price: 3500,
        image:[image4],
        category: "Furniture",
        subCategory: "Kitchen",
        colors: ["white","blue","gray"],
        date: 21022025,
        bestseller:false
    },
    {
        id:"DECO-005",
        name: "Frame",
        description: "A stylish frame that enhances your photos and artwork, adding a touch of elegance and personality to any space.",
        price: 35,
        image:[image5],
        category: "Accessories",
        subCategory: "Home Decor",
        colors: ["white","black","gray"],
        date: 22022025,
        bestseller:false
    },
    {
        id:"DECO-006",
        name: "Cozy Lighting Lamp",
        description: "Elegant lamps that add warmth and style to any room, perfect for both functionality and décor.",
        price: 120,
        image:[image6],
        category: "Lighting",
        subCategory: "Floor Lamps",
        colors: ["blue","white"],
        date: 23022025,
        bestseller:true
    },
    {
        id:"DECO-007",
        name: "Unique vase",
        description: "A one-of-a-kind vase that adds character and charm to your home décor",
        price: 320,
        image:[image7],
        category: "Accessories",
        subCategory: "Home Decor",
        colors: ["brown"],
        date: 24022025,
        bestseller:false
    },
    {
        id:"DECO-008",
        name: "Woodland Seat",
        description:"A timeless wooden chair that combines comfort and natural elegance for any space.",
        price: 1000,
        image:[image8],
        category: "Furniture",
        subCategory: "Living Room",
        colors: ["brown"],
        date: 25022025,
        bestseller:true
    },
    {
        id:"DECO-009",
        name: "Reflecto Frame",
        description: "A beautifully crafted mirror frame that enhances your reflection. while adding a touch of sophistication to any room.",
        price: 490,
        image:[image9],
        category: "Decorative Art",
        subCategory: "Mirrors",
        colors: ["brown"],
        date: 26022025,
        bestseller:true
    },
    {
        id:"DECO-010",
        name: "Cozy and simple dinning table",
        description: "A simple yet incredibly cozy chair designed for ultimate comfort and relaxation in any space.",
        price: 895,
        image:[image10],
        category: "Furniture",
        subCategory: "Dining Room",
        colors: ["white","gray","black"],
        date: 27022025,
        bestseller:false
    }
]