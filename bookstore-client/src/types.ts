// types.ts

// This TypeScript type matches one book object coming back from the API.
export type Book = {
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

// The API also sends pagination details so the UI knows how many pages exist.
export type Pagination = {
  totalBooks: number
  pageSize: number
  currentPage: number
  totalPages: number
  sortOrder: 'asc' | 'desc'
  category: string | null
}

// This represents the full shape of the API response.
export type BookResponse = {
  books: Book[]
  pagination: Pagination
}

// This represents an item in the shopping cart.
export type CartItem = {
  book: Book
  quantity: number
}
