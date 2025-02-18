import React, { useState, useEffect } from 'react'
import { useCallback } from 'react';
import Card from './components/Card';
import { getData } from './data/products';
import { totalPrice } from './units/totalPrice';
import logo from "../public/logo.png"

export default function App() {
  const courses = getData();
  const [cartItems, setCartItems] = useState([]);

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

    fetch("https://turinmerch-server.onrender.com/web-data", {
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
    telegram.ready();
    telegram.MainButton.text = "Checkout";
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
      <div className='container'>
        {courses.map(item =>
          <Card details={item} onRemoveItem={onRemoveItem} onAddItem={onAddItem} />)}
      </div>
      <div className='cart-btn'>
        <span style={{ marginRight: "5px" }}>Umumiy summa: <span className='pricee'> {totalPrice(cartItems)}</span></span> <img width="25" height="25" src="https://img.icons8.com/stickers/50/shopping-cart.png" alt="shopping-cart" />
      </div>
    </>
  )
}
