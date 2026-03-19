import { useEffect, useState } from 'react'
import './App.css'

type Book = {
  bookID: number
  title: string
  author: string
  publisher: string
  isbn: string
  classification: string
  category: string
  pageCount: number
  price: number
}

type Pagination = {
  totalBooks: number
  pageSize: number
  currentPage: number
  totalPages: number
  sortOrder: 'asc' | 'desc'
}

type BookResponse = {
  books: Book[]
  pagination: Pagination
}

const apiBaseUrl = 'http://localhost:5033'

function App() {
  const [books, setBooks] = useState<Book[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [totalPages, setTotalPages] = useState(1)
  const [totalBooks, setTotalBooks] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true)
        setError('')

        const response = await fetch(
          `${apiBaseUrl}/books?pageSize=${pageSize}&pageNum=${currentPage}&sortOrder=${sortOrder}`,
        )

        if (!response.ok) {
          throw new Error('The bookstore data could not be loaded.')
        }

        const data: BookResponse = await response.json()
        setBooks(data.books)
        setTotalPages(data.pagination.totalPages)
        setTotalBooks(data.pagination.totalBooks)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchBooks()
  }, [currentPage, pageSize, sortOrder])

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="app-shell">
      <header className="hero-section text-white">
        <div className="container py-5">
          <p className="eyebrow mb-2">Mission 11 Online Bookstore</p>
          <h1 className="display-5 fw-bold">Browse Prof. Hilton&apos;s favorite books</h1>
          <p className="lead hero-copy mb-0">
            View every title in the database, change how many results appear per page,
            and sort the collection by book title.
          </p>
        </div>
      </header>

      <main className="container my-5">
        <section className="card shadow-sm border-0 bookstore-card">
          <div className="card-body p-4 p-lg-5">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
              <div>
                <h2 className="h3 mb-1">Book Catalog</h2>
                <p className="text-secondary mb-0">
                  Showing {books.length} of {totalBooks} books from the SQLite database.
                </p>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-3 controls-row">
                <div>
                  <label className="form-label fw-semibold" htmlFor="pageSize">
                    Results per page
                  </label>
                  <select
                    id="pageSize"
                    className="form-select"
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value))
                      setCurrentPage(1)
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </select>
                </div>

                <div>
                  <label className="form-label fw-semibold" htmlFor="sortOrder">
                    Sort by title
                  </label>
                  <select
                    id="sortOrder"
                    className="form-select"
                    value={sortOrder}
                    onChange={(event) => {
                      setSortOrder(event.target.value as 'asc' | 'desc')
                      setCurrentPage(1)
                    }}
                  >
                    <option value="asc">A to Z</option>
                    <option value="desc">Z to A</option>
                  </select>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="alert alert-light border text-center mb-0">Loading books...</div>
            ) : error ? (
              <div className="alert alert-danger mb-0">{error}</div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle mb-4">
                    <thead className="table-dark">
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>ISBN</th>
                        <th>Classification</th>
                        <th>Category</th>
                        <th>Pages</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((book) => (
                        <tr key={book.bookID}>
                          <td className="fw-semibold">{book.title}</td>
                          <td>{book.author}</td>
                          <td>{book.publisher}</td>
                          <td>{book.isbn}</td>
                          <td>{book.classification}</td>
                          <td>{book.category}</td>
                          <td>{book.pageCount}</td>
                          <td>${book.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <p className="mb-0 text-secondary">
                    Page {currentPage} of {totalPages}
                  </p>

                  <nav aria-label="Book pagination">
                    <ul className="pagination pagination-sm mb-0 flex-wrap">
                      {pageNumbers.map((pageNumber) => (
                        <li
                          key={pageNumber}
                          className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(pageNumber)}
                            type="button"
                          >
                            {pageNumber}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
