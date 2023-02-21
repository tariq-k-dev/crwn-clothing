import { Outlet } from 'react-router-dom';
import Categories from '../../components/categories/categories.component';

import categories from '../../data/categories.json';

const Home = () => (
  <>
    <Outlet />
    <Categories categories={categories} />
  </>
);

export default Home;
