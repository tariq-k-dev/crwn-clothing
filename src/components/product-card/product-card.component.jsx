import Button from '../button/button.component';

import './product-card.styles.scss';

const ProductCard = ({ product }) => {
  const { name, imageUrl, price } = product;

  return (
    <div className='product-card-container'>
      <img src={imageUrl} alt={`${name}`} />
      <div className='footer'>
        <span className='name'>{name}</span>
        <span className='price'>${price.toFixed(2)}</span>
      </div>
      <Button buttonType='inverted'>ADD TO CART</Button>
    </div>
  );
};

export default ProductCard;
