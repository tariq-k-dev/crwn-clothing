import { createContext, useState, useEffect } from 'react';

const addCartItem = (cartItems, productToAdd) => {
  const existingCartItem = cartItems.find(item => item.id === productToAdd.id);

  if (existingCartItem) {
    return cartItems.map(cartItem =>
      cartItem.id === productToAdd.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }

  return [...cartItems, { ...productToAdd, quantity: 1 }];
};

export const CartContext = createContext({
  isCartOpen: false,
  setIsCartOpen: () => null,
  cartItems: [],
  addItemToCart: () => {},
  cartCount: 0,
});

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const addItemToCart = productToAdd => {
    setCartItems(addCartItem(cartItems, productToAdd));
  };
  const decreaseItemQuantity = (id, quantity) => {
    if (quantity === 1) {
      removeCartItem(id);

      return;
    }
    const newCartItems = cartItems.map(cartItem => {
      if (cartItem.id === id && cartItem.quantity > 1) {
        cartItem.quantity -= 1;
      }

      return cartItem;
    });

    setCartItems(newCartItems);
  };
  const increaseItemQuantity = id => {
    const newCartItems = cartItems.map(cartItem => {
      if (cartItem.id === id && cartItem.quantity < 20) {
        cartItem.quantity += 1;
      }
      return cartItem;
    });

    setCartItems(newCartItems);
  };
  const removeCartItem = id => {
    const newCartItems = cartItems.filter(cartItem => cartItem.id !== id);

    setCartItems(newCartItems);
  };
  const value = {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    setCartItems,
    addItemToCart,
    cartCount,
    decreaseItemQuantity,
    increaseItemQuantity,
    removeCartItem,
  };

  useEffect(() => {
    const newCartCount = cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );

    setCartCount(newCartCount);
  }, [cartItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
