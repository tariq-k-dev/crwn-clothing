import { useContext } from 'react';
import { CartContext } from '../../contexts/cart.context';
import CheckoutItem from '../../components/checkout-item/checkout-item.component';
import './checkout.styles.scss';

const Checkout = () => {
  const { cartItems } = useContext(CartContext);
  let totalPrice = 0;

  return (
    <main className='checkout-container'>
      <div className='headings'>
        <span>Product</span>
        <span>Description</span>
        <span>Quantity</span>
        <span>Price</span>
        <span>Remove</span>
      </div>
      {cartItems.map(cartItem => {
        const { id, price, quantity } = cartItem;
        totalPrice += quantity * price;

        return <CheckoutItem key={id} cartItem={cartItem} />;
      })}
      {totalPrice > 0 && (
        <div className='total-price'>Total: ${totalPrice.toFixed(2)}</div>
      )}
    </main>
  );
};

export default Checkout;
