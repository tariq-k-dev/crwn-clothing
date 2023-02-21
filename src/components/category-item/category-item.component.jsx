import './category-item.styles.scss';

const CategoryItem = ({ category: { title, imageUrl } }) => (
  <div className='category-container'>
    <div
      className='background-image'
      style={{ backgroundImage: `url(${imageUrl})` }}
    />
    <div className='category-body-container'>
      <h2>{`${title.slice(0, 1).toUpperCase()}${title.slice(1)}`}</h2>
      <p>Shop Now</p>
    </div>
  </div>
);

export default CategoryItem;
