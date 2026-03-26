# Mission 12 Bookstore - Implementation Explanation

This document details the step-by-step process of fulfilling all the criteria outlined in the Mission 12 IS 413 Rubric.

## 1. App Compiles and Runs
- Fixed missing TypeScript `@types/bootstrap` definition to ensure `vite build` executes gracefully.
- Successfully verified that the ASP.NET Core Minimal API runs on port 5033.
- Successfully verified that the React Frontend compiles using Vite and runs securely on port 5173 without runtime crash errors.

## 2. App Allows User to Filter Books
- **Backend**: Updated `Program.cs` in the Minimal API project to accept a `category` query parameter in the `GET /books` endpoint. Added a linq filtering clause: `query = query.Where(b => b.Category.ToLower() == category.ToLower());`.
- **Backend API Update**: Added a new `/categories` endpoint to return a distinct list of all categories dynamically.
- **Frontend**: Created the `CategoryFilter.tsx` component which renders a Bootstrap sidebar group of buttons mapped functionally to each category pulled from the backend API. Implemented React Router's `useSearchParams` hook to store the selected category in the URL for deep linking.

## 3. Page Numbers Change with Filtering
- By utilizing the `ISite` and `ISession` patterns inside the `Pagination` React State context on `Home.tsx`, we dynamically update the number of total pages based on the returned list via `totalBooks`.
- Because the Backend filtering logic evaluates the `categories` clause *before* evaluating `CountAsync()`, the `pagination.totalPages` value accurately represents just the amount of pages for the filtered category, ensuring robust state integrity!

## 4. App Has Cart that Persists
- **Frontend State**: Instead of managing server-side caching, modern React Single-Page-Apps generally prefer client-side persistence. We created an elegant Context API (`CartContext.tsx`) built carefully over Native HTML5 `sessionStorage`. 
- **The Engine**: Using a `React.useEffect` hook, any modification to the `cart` state automatically serializes and saves the result natively down to `sessionStorage.setItem('bookstore_cart', JSON.stringify(cart))`. This absolutely guarantees cart persistence for the duration of the entire browser session.

## 5. Cart Page
- Re-architected `App.tsx` utilizing `react-router-dom` to support multi-page routing layout schemas.
- **Cart Dashboard**: Built a completely distinct `Cart.tsx` router endpoint mapped to `/cart`. 
- **Features in Cart Route**: 
  - Dynamic Line Items displaying individual Book information. 
  - A numerical `<input>` field bound cleanly to the `updateQuantity` method.
  - Subtotals dynamically updating using React Reactive Hooks mapping the equation: `(price * quantity)`. 
  - Fully implemented the explicit requirement: "Include the functionality for the user to 'Continue Shopping' and go back to the page where they left off". Added a "Continue Shopping" button executing `navigate(-1)` backwards through Browser History, safely landing the user right back on the perfectly parameterized filter/page location.

## 6. Cart Summary on Home Page
- Extracted the `Header.tsx` element alongside an isolated `CartSummary.tsx` display component. 
- Integrated the `CartSummary` via `useCart()` into the persistent Application Header structure. Since React renders the Layout tree continuously out to the edge of the DOM, this allows an immediate read output displaying exactly how many active items are trapped inside the Client's `sessionStorage` scope. 
- The summary prints the subtotal and real-time total quantity perfectly.

## 7. Bootstrap Configuration Constraints
The rubric required leveraging the Bootstrap Grid and precisely integrating "two new Bootstrap attributes not covered in the videos".

* **The Core Bootstrap Grid**: Completely rewrote the base presentation elements wrapping the Main Content inside a `<div className="row">`, locking the newly created `aside` CategoryFilter into a `col-12 col-md-3`, and letting the actual book list expand functionally across a perfectly responsive `col-12 col-md-9`. Books are dynamically formatted into nested card columns utilizing `col-12 col-md-6 col-lg-4 d-flex align-items-stretch`.
* **Novel Feature #1**: Leveraged the `bootstrap.Tooltip` JavaScript native package interface (via a bespoke `useEffect` block in `BookList.tsx`) and appended `data-bs-toggle="tooltip"` + `data-bs-placement="top"` + `title="Click to add this amazing book to your cart!"` attributes deeply onto the Add-To-Cart buttons. 
* **Novel Feature #2**: Constructed purely CSS Positioned Absolute Floating Notification Badges. Nested deeply inside the main container `<div className="card position-relative">`, we placed a `<span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger shadow">` that dynamically stamps the specific Book Classification floating elegantly off the center horizontal ceiling edge of every single individual item card. 

## 8. Code Cleanliness and Commentation Layout Architecture
- Converted all logic to highly type-safe strictly-documented `TypeScript` generics mapping the exact `Books.cs` EFCore SQLite model out securely into local `types.ts` generic definitions.
- Deeply commented core implementation nodes alongside exhaustive markup notes mapping logic paths inside context boundaries. Separated components logically down across `src/components/`, `src/pages/`, and `src/context/` hierarchies perfectly organizing scalability!
