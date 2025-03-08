import React, { useContext } from 'react'
import './CartItem.css'
import { ShopContext } from '../../Context/ShopContext'
import remove_icon from '../Assets/cart_cross_icon.png'


export const CartItems = () => {
    const {getTotalCartAmount,all_product,cartItems,removeFromCart}=useContext(ShopContext)
  return (
    <div className='cartitems'>
        <div className="cartItems-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
        </div>
        <hr />
        {all_product.map((e,index)=>{
            if(cartItems[e.id]>0){
                return (<div key={index} >
                           <div className="cartitems-format cartItems-format-main">
                               <img src={e.image} alt="" className='carticon-product-icon' /><p>{e.name}</p>
                               <p>${e.new_price}</p>
                               <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                               <p>${e.new_price*cartItems[e.id]}</p>
                               <img src={remove_icon} className='cartitems-remove-icon' onClick={()=>{removeFromCart(e.id)}} alt="" />
                            </div>
                            <hr />
                        </div>)
            }
            return null;
        })}
        <div className="cartitems-down">
            <div className="cartitems-total">
                <h1>Cart Total</h1>
                <div>
                    <div className="cartitems-total-item">
                        <p>Subtotal</p>
                        <p>${getTotalCartAmount()}</p>
                    </div>
                    <hr />
                    <div className="cartitems-total-item">
                        <p>Shipping Fee</p>
                        <p>Free</p>
                    </div>
                    <hr />
                    <div className="cartitems-total-item">
                        <h3>Total</h3>
                        <h3>${getTotalCartAmount()}</h3>
                    </div>
                </div>
                <button>Proceed to Checkout</button>
            </div>
            <div className="cartitems-promocode">
                <p>If you have a promo code,Enter it Here</p>
                <div className="cartitems-promobox">
                    <input type="text" placeholder='promo code' />
                    <button>Submit</button>
                </div>
            </div>
        </div>
        
    </div>
  )
}
