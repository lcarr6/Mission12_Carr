import React, { useEffect } from 'react';
import type { Book } from '../types';
import { useCart } from '../context/CartContext';
// Import bootstrap to initialize tooltips
import { Tooltip } from 'bootstrap';

interface BookListProps {
  books: Book[];
}

export const BookList: React.FC<BookListProps> = ({ books }) => {
  const { addToCart } = useCart();

  // Initialize Bootstrap Tooltips (Requirement: #notcoveredinthevideos)
  useEffect(() => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => {
      return new Tooltip(tooltipTriggerEl);
    });
    
    // Cleanup tooltips on unmount
    return () => {
      tooltipList.forEach(t => t.dispose());
    };
  }, [books]); // Re-initialize when books change

  return (
    <div className="row g-4">
      {books.map((book) => (
        <div key={book.bookID} className="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
          <div className="card w-100 shadow-sm border-0 h-100 position-relative">
            {/* Bootstrap Badge (#notcoveredinthevideos) */}
            <span 
              className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger shadow"
              style={{ zIndex: 1 }}
            >
              {book.classification}
            </span>
            
            <div className="card-body d-flex flex-column mt-2">
              <h5 className="card-title fw-bold mb-1">{book.title}</h5>
              <h6 className="card-subtitle mb-3 text-muted">{book.author}</h6>
              
              <ul className="list-unstyled flex-grow-1 mb-4 text-secondary small">
                <li><strong>Publisher:</strong> {book.publisher}</li>
                <li><strong>ISBN:</strong> {book.isbn}</li>
                <li><strong>Category:</strong> {book.category}</li>
                <li><strong>Pages:</strong> {book.pageCount}</li>
              </ul>
              
              <div className="mt-auto d-flex justify-content-between align-items-center">
                <span className="fs-5 fw-bold text-success">${book.price.toFixed(2)}</span>
                <button 
                  className="btn btn-primary btn-sm rounded-pill fw-semibold shadow-sm px-3"
                  onClick={() => addToCart(book)}
                  data-bs-toggle="tooltip" 
                  data-bs-placement="top" 
                  title="Click to add this amazing book to your cart!"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
