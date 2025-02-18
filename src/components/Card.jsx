import React, { useState } from 'react';
import minus from "../assets/minus.png";
import plus from "../assets/plus.png";

export default function Card({ details, onAddItem, onRemoveItem }) {
  const [quantity, setQuantity] = useState(0);
  const handleIncrement = () => {
    setQuantity(quantity + 1);
    onAddItem(details);
  }
  const handleDecrement = () => {
    setQuantity(quantity - 1);
    onRemoveItem(details);
  }
  let formattedPrice = details.price.toLocaleString("uz-UZ", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
});
  return (
    <div class="product">
      {quantity > 0 ? <span class="quantity">{quantity}</span> : null}
      <img class="product__image" src={details.Image} />
      <h1 class="product__title">{details.title}</h1>
      <span className='product__price'>{formattedPrice}</span>
      {quantity > 0 ?
        <div className='quantityBtns'>
          <a class="plus__btn btn" onClick={handleIncrement}><img width="15" height="15" src={plus} alt="plus" /></a>
          <a class="minus__btn btn" onClick={handleDecrement}><img width="15" height="15" src={minus} alt="minus" /></a>
        </div>
        :
        <a class="product__btn btn" onClick={handleIncrement}>Add</a>
      }
    </div>
  )
}
