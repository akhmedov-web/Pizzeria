import React, { useState, useEffect } from 'react'
import { useCallback } from 'react';
import Card from './components/Card';
import { getData } from './data/products';
import { totalPrice } from './units/totalPrice';
import logo from "../public/logo.png"

export default function App() {
  const courses = getData();
  const [cartItems, setCartItems] = useState([]);
  const [sticky, setSticky]=useState(false)

  // Get Telegram WebApp object
  const telegram = window.Telegram.WebApp;

  // Callback to handle sending data to the server
  const onSendData = useCallback(() => {
    const queryID = telegram.initDataUnsafe?.query_id;
    const userID = telegram.initDataUnsafe?.user?.id;

    // Ensure the user_id is available before sending data
    if (!userID) {
      console.error("User ID is missing");
      return;
    }

    fetch("https://pizzeria-server-srvk.onrender.com/web-data", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ products: cartItems, queryID: queryID, userID: userID }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data); // Handle response from the server
        telegram.close(); // ✅ Close the web app after successful submission
      });
  }, [cartItems]);
  useEffect(() => {
    const handleScroll = (event) => {
      if(window.pageYOffset>130){
        setSticky(true);
      }else{
        setSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    telegram.ready();
    telegram.MainButton.text = "Hisobga o'tish";
    cartItems.length > 0 ? telegram.MainButton.show() : telegram.MainButton.hide();
    // Attach the event listener for the main button click
    telegram.onEvent('mainButtonClicked', onSendData);

    // Clean up the event listener
    return () => telegram.offEvent('mainButtonClicked', onSendData);
  }, [onSendData]);
  // Function to add an item to the cart
  const onAddItem = (item) => {
    const existItem = cartItems.find(p => p.id == item.id);

    if (existItem) {
      const newData = cartItems.map(p =>
        p.id == item.id ? { ...existItem, quantity: existItem.quantity + 1 }
          : p
      )
      setCartItems(newData);
    } else {
      const newData = [...cartItems, { ...item, quantity: 1 }];
      setCartItems(newData);
    }

  }

  // Function to remove an item to the cart
  const onRemoveItem = (item) => {
    const existItem = cartItems.find(p => p.id == item.id);

    if (existItem.quantity == 1) {
      const newData = cartItems.filter(p => p.id !== existItem.id);
      setCartItems(newData);
    } else {
      const newData = cartItems.map(p =>
        p.id == existItem.id ?
          { ...existItem, quantity: existItem.quantity - 1 }
          : p
      );
      setCartItems(newData);
    }
  }

  return (
    <>
      <header><img src={logo} alt="img" className='logo'/></header>
      <div className={`tags-container ${sticky?"sticky":""}`}>
        <a href="#asosiy" className='tag active_tag'>asosiy</a>
        <a href="#shashlik" className='tag' onClick={()=>{window.scrollTo(0, 2010)}}>shashliklar</a>
        <a href="#salat" className='tag'>salatlar</a>
        <a href="#ichimlik" className='tag'>ichimliklar</a>
        <a href="#desert" className='tag'>desertlar</a>  
      </div>
      <div className='container'>
        <h2 className='category-title' id="asosiy">Asosiy</h2>
        <div className="product-container">
        {courses.filter(item => item.category === "asosiy").map((item,id) =>
          <Card id={id} details={item} onRemoveItem={onRemoveItem} onAddItem={onAddItem} />)}
        </div>
        <h2 className='category-title' id="shashlik">Shashliklar</h2>
        <div className="product-container">
        {courses.filter(item => item.category === "shashlik").map((item,id) =>
          <Card id={id} details={item} onRemoveItem={onRemoveItem} onAddItem={onAddItem} />)}
        </div>
        <h2 className='category-title' id="salat">Salatlar</h2>
        <div className="product-container">
        {courses.filter(item => item.category === "salat").map((item,id) =>
          <Card id={id} details={item} onRemoveItem={onRemoveItem} onAddItem={onAddItem} />)}
        </div>
        <h2 className='category-title' id="ichimlik">Ichimliklar</h2>
        <div className="product-container">
        {courses.filter(item => item.category === "ichimlik").map((item,id) =>
          <Card id={id} details={item} onRemoveItem={onRemoveItem} onAddItem={onAddItem} />)}
        </div>
        
        <h2 className='category-title' id="desert">Desert</h2>
        <div className="product-container">
        {courses.filter(item => item.category === "desert").map((item,id) =>
          <Card id={id} details={item} onRemoveItem={onRemoveItem} onAddItem={onAddItem} />)}
          </div>
        </div>
      
      <div className='cart-btn'>
        <span style={{ marginRight: "5px" }}>Umumiy summa: <span className='pricee'> {totalPrice(cartItems)}</span></span> <img width="25" height="25" src="https://img.icons8.com/stickers/50/shopping-cart.png" alt="shopping-cart" />
      </div>
    </>
  )
}
