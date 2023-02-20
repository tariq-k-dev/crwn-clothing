import Categories from './components/categories/categories.component';

import categories from './data/categories.json';
import './categories.styles.scss';

const App = () => <Categories categories={categories} />;

export default App;
