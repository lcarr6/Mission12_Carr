import React, { useEffect, useState } from 'react';
import type { Book, BookResponse } from '../types';

const apiBaseUrl = 'https://hilton-bookstore-api-13.azurewebsites.net';

export const Admin: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Partial<Book> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination for admin view
  const [pageParam, setPageParam] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const url = `${apiBaseUrl}/books?pageSize=${pageSize}&pageNum=${pageParam}&sortOrder=asc`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Data could not be loaded.');
      const data: BookResponse = await response.json();
      setBooks(data.books);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchBooks();
  }, [pageParam]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      const resp = await fetch(`${apiBaseUrl}/books/${id}`, { method: 'DELETE' });
      if (resp.ok) {
        void fetchBooks();
      } else {
        alert('Failed to delete book');
      }
    } catch {
      alert('Error connecting to the server.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    const isNew = !editingBook.bookID;
    const url = isNew ? `${apiBaseUrl}/books` : `${apiBaseUrl}/books/${editingBook.bookID}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const resp = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBook),
      });

      if (resp.ok) {
        setIsFormOpen(false);
        setEditingBook(null);
        void fetchBooks();
      } else {
        alert('Failed to save book');
      }
    } catch {
      alert('Error connecting to the server.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let finalValue: string | number = value;

    if (name === 'pageCount' || name === 'price') {
      finalValue = Number(value);
    }

    setEditingBook((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <main className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Book Administration</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingBook({
              title: '', author: '', publisher: '', isbn: '',
              classification: '', category: '', pageCount: 0, price: 0
            });
            setIsFormOpen(true);
          }}
        >
          Add New Book
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {isFormOpen && editingBook && (
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">{editingBook.bookID ? 'Edit Book' : 'Add Book'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSave}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Title</label>
                  <input required name="title" className="form-control" value={editingBook.title || ''} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Author</label>
                  <input required name="author" className="form-control" value={editingBook.author || ''} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Publisher</label>
                  <input required name="publisher" className="form-control" value={editingBook.publisher || ''} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">ISBN</label>
                  <input required name="isbn" className="form-control" value={editingBook.isbn || ''} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Classification</label>
                  <input required name="classification" className="form-control" value={editingBook.classification || ''} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Category</label>
                  <input required name="category" className="form-control" value={editingBook.category || ''} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Page Count</label>
                  <input required type="number" name="pageCount" className="form-control" value={editingBook.pageCount || 0} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Price</label>
                  <input required type="number" step="0.01" name="price" className="form-control" value={editingBook.price || 0} onChange={handleChange} />
                </div>
              </div>
              <div className="mt-4 d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-success">Save Book</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div>Loading books...</div>
      ) : (
        <>
          <div className="table-responsive shadow-sm rounded border">
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.bookID}>
                    <td className="fw-semibold">{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td>${book.price.toFixed(2)}</td>
                    <td className="text-end">
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => {
                          setEditingBook(book);
                          setIsFormOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(book.bookID)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-end mt-4">
              <nav>
                <ul className="pagination">
                  {pageNumbers.map(num => (
                    <li key={num} className={`page-item ${num === pageParam ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setPageParam(num)}>
                        {num}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </main>
  );
};
