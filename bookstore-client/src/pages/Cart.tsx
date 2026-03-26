import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container my-5">
      <h2 className="mb-4">Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="alert alert-info text-center">
          <h4>Your cart is currently empty.</h4>
          <p className="mb-0">Head back to the catalog to add some items!</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="row">
          <div className="col-12 col-lg-8 mb-4 mb-lg-0">
            <div className="table-responsive shadow-sm rounded">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Item</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-end">Price</th>
                    <th className="text-end">Subtotal</th>
                    <th className="text-center">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.book.bookID}>
                      <td>
                        <strong>{item.book.title}</strong>
                        <br />
                        <small className="text-muted">{item.book.author}</small>
                      </td>
                      <td className="text-center">
                        <input
                          type="number"
                          className="form-control form-control-sm text-center mx-auto"
                          style={{ maxWidth: '80px' }}
                          value={item.quantity}
                          min="1"
                          onChange={(e) =>
                            updateQuantity(item.book.bookID, parseInt(e.target.value) || 1)
                          }
                        />
                      </td>
                      <td className="text-end">${item.book.price.toFixed(2)}</td>
                      <td className="text-end fw-semibold">
                        ${(item.book.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeFromCart(item.book.bookID)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-3">
              <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                &larr; Continue Shopping
              </button>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card shadow-sm border-0 bg-light">
              <div className="card-body p-4">
                <h4 className="card-title fw-bold mb-4">Order Summary</h4>
                <div className="d-flex justify-content-between mb-3">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Tax (0%)</span>
                  <span>$0.00</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold fs-5">Total</span>
                  <span className="fw-bold fs-5">${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  className="btn btn-success w-100 py-2 fw-semibold"
                  onClick={() => {
                    alert('Thank you for your order!');
                    clearCart();
                    navigate('/');
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
