import { useContext } from 'react';
import { CartContext } from '../../contexts/cart.context';
import './checkout-item.styles.scss';
import { ReactComponent as DecreaseIcon } from '../../assets/minus-square.svg';
import { ReactComponent as IncreaseIcon } from '../../assets/plus-square.svg';
import { ReactComponent as RemoveIcon } from '../../assets/remove-box.svg';

const CheckoutItem = ({ cartItem }) => {
  const { decreaseItemQuantity, increaseItemQuantity, removeCartItem } =
    useContext(CartContext);
  const { id, name, imageUrl, price, quantity } = cartItem;
  const decreaseProductQuantity = () => decreaseItemQuantity(id, quantity);
  const increaseProductQuantity = () => increaseItemQuantity(id);
  const removeItemHandler = () => removeCartItem(id);

  return (
    <div className='cart-items'>
      <span>
        <img src={imageUrl} alt={name} />
      </span>
      <span>{name}</span>
      <span className='quantity-container'>
        <DecreaseIcon
          className='decrease-button'
          onClick={decreaseProductQuantity}
        />
        <span className='quantity'>{quantity}</span>
        <IncreaseIcon
          className='increase-button'
          onClick={increaseProductQuantity}
        />
      </span>
      <span>${(price * quantity).toFixed(2)}</span>
      <span>
        <RemoveIcon className='remove-item' onClick={removeItemHandler} />
      </span>
    </div>
  );
};

export default CheckoutItem;
