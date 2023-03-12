import { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import CartIcon from '../../components/cart-icon/cart-icon.component';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.component';

import { UserContext } from '../../contexts/user.context';
import { signOutUser } from '../../utils/firebase/firebase.utils';
import { CartContext } from '../../contexts/cart.context';

import { ReactComponent as CrwnLogo } from '../../assets/crown.svg';

import './navigation.styles.scss';

const Navigation = () => {
  const { currentUser } = useContext(UserContext);
  const { isCartOpen, setIsCartOpen } = useContext(CartContext);
  const closeCartOpenHandler = () => setIsCartOpen(false);

  return (
    <>
      <nav className='navigation'>
        <NavLink
          className='logo-container'
          exact='true'
          to='/'
          onClick={closeCartOpenHandler}
        >
          <CrwnLogo className='logo' />
        </NavLink>
        <div className='nav-links-container'>
          <NavLink
            className='nav-link'
            exact='true'
            to='/'
            onClick={closeCartOpenHandler}
          >
            <span className='border-bottom'>HOME</span>
          </NavLink>
          <NavLink
            className='nav-link'
            to='/shop'
            onClick={closeCartOpenHandler}
          >
            <span className='border-bottom'>SHOP</span>
          </NavLink>
          {currentUser ? (
            <NavLink className='nav-link' to='/auth' onClick={signOutUser}>
              <span className='border-bottom'>SIGN OUT</span>
            </NavLink>
          ) : (
            <NavLink
              className='nav-link'
              to='/auth'
              onClick={closeCartOpenHandler}
            >
              <span className='border-bottom'>SIGN IN</span>
            </NavLink>
          )}
          <CartIcon />
        </div>
        {isCartOpen && <CartDropdown />}
      </nav>
      <Outlet />
    </>
  );
};

export default Navigation;
