import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Book, BookResponse } from '../types';
import { CategoryFilter } from '../components/CategoryFilter';
import { BookList } from '../components/BookList';

const apiBaseUrl = 'http://localhost:5033';

export const Home: React.FC = () => {
  // Use React Router's search params to keep track of URL state for deep linking
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryParam = searchParams.get('category');
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const pageSizeParam = parseInt(searchParams.get('pageSize') || '5', 10);
  const sortOrderParam = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';

  // State
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    void fetchCategories();
  }, []);

  // Fetch books when URL params change
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        setError('');

        let url = `${apiBaseUrl}/books?pageSize=${pageSizeParam}&pageNum=${pageParam}&sortOrder=${sortOrderParam}`;
        if (categoryParam) {
          url += `&category=${encodeURIComponent(categoryParam)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('The bookstore data could not be loaded.');
        }

        const data: BookResponse = await response.json();

        setBooks(data.books);
        setTotalPages(data.pagination.totalPages);
        setTotalBooks(data.pagination.totalBooks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchBooks();
  }, [categoryParam, pageParam, pageSizeParam, sortOrderParam]);

  // Helper function to update search params
  const updateParams = (newParams: Record<string, string | null>) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    
    // Merge params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        delete currentParams[key];
      } else {
        currentParams[key] = value;
      }
    });

    setSearchParams(currentParams);
  };

  const handleSelectCategory = (category: string | null) => {
    // When changing categories, reset back to page 1
    updateParams({ category, page: '1' });
  };

  // Build page numbers 
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <main className="container my-5">
      <div className="row">
        {/* Sidebar for Categories (Bootstrap Grid structure #1) */}
        <aside className="col-12 col-md-3 mb-4 mb-md-0">
          <CategoryFilter 
            categories={categories}
            selectedCategory={categoryParam}
            onSelectCategory={handleSelectCategory}
          />
        </aside>

        {/* Main Content for Books (Bootstrap Grid structure #2) */}
        <section className="col-12 col-md-9">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
            <div>
              <h2 className="h3 mb-1">
                {categoryParam ? `${categoryParam} Books` : 'All Books'}
              </h2>
              <p className="text-secondary mb-0">
                Showing {books.length} of {totalBooks} books 
                {categoryParam && ` in ${categoryParam}`}.
              </p>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-3">
              <div>
                <label className="form-label fw-semibold mb-1" htmlFor="pageSize">
                  Results per page
                </label>
                <select
                  id="pageSize"
                  className="form-select form-select-sm"
                  value={pageSizeParam}
                  onChange={(e) => updateParams({ pageSize: e.target.value, page: '1' })}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>
              <div>
                <label className="form-label fw-semibold mb-1" htmlFor="sortOrder">
                  Sort
                </label>
                <select
                  id="sortOrder"
                  className="form-select form-select-sm"
                  value={sortOrderParam}
                  onChange={(e) => updateParams({ sortOrder: e.target.value, page: '1' })}
                >
                  <option value="asc">A to Z</option>
                  <option value="desc">Z to A</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="alert alert-light border text-center my-4 py-5 shadow-sm">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h4>Loading books...</h4>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              <BookList books={books} />

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-top pt-4 mt-5">
                  <p className="mb-0 text-secondary fw-semibold">
                    Page {pageParam} of {totalPages}
                  </p>

                  <nav aria-label="Book catalog pagination">
                    <ul className="pagination pagination-sm mb-0 flex-wrap shadow-sm">
                      {pageNumbers.map((pageNumber) => (
                        <li
                          key={pageNumber}
                          className={`page-item ${pageNumber === pageParam ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => updateParams({ page: pageNumber.toString() })}
                            type="button"
                          >
                            {pageNumber}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};
