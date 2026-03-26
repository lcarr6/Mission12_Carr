import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Book, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book) => void;
  updateQuantity: (bookID: number, quantity: number) => void;
  removeFromCart: (bookID: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Initialize state from sessionStorage if available
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = sessionStorage.getItem('bookstore_cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Whenever the cart changes, save it to sessionStorage so it persists across page reloads
  useEffect(() => {
    sessionStorage.setItem('bookstore_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book: Book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.book.bookID === book.bookID);
      if (existingItem) {
        // If the book is already in the cart, increase quantity
        return prevCart.map((item) =>
          item.book.bookID === book.bookID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // New item
      return [...prevCart, { book, quantity: 1 }];
    });
  };

  const updateQuantity = (bookID: number, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item.book.bookID !== bookID);
      }
      return prevCart.map((item) =>
        item.book.bookID === bookID ? { ...item, quantity } : item
      );
    });
  };

  const removeFromCart = (bookID: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.book.bookID !== bookID));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Derived state calculations
  const cartTotal = cart.reduce((total, item) => total + item.book.price * item.quantity, 0);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
