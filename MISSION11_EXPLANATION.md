# Mission 11 Assignment Explanation

## Overview

This project is an online bookstore built with an ASP.NET Core Web API backend and a React + TypeScript frontend. The app connects to the provided SQLite database and displays the books in a Bootstrap-styled interface. It also includes dynamic pagination, a user-controlled page size, and sorting by book title.

## Project Structure

- `books.db`
  - The SQLite database file downloaded from the assignment link.
- `Mission11_Carr.sln`
  - The Visual Studio solution file for the backend project.
- `BookstoreApi/`
  - The ASP.NET Core API project.
- `bookstore-client/`
  - The React frontend project created with Vite and TypeScript.

## Database and Model Setup

I inspected the SQLite database schema directly to make sure the model matched the database exactly. The `Books` table contains these fields:

- `BookID`
- `Title`
- `Author`
- `Publisher`
- `ISBN`
- `Classification`
- `Category`
- `PageCount`
- `Price`

To match that table, I created a `Book` model in the API project with the same field names and types. I also created a `BookstoreContext` Entity Framework Core context so the API can query the SQLite database.

### Files added for the database layer

- `BookstoreApi/Models/Book.cs`
- `BookstoreApi/Data/BookstoreContext.cs`

### Important implementation details

- The `Book` class is mapped to the `Books` table with the `[Table("Books")]` attribute.
- `BookID` is the primary key.
- All of the required columns are included in the model.
- The API uses `Microsoft.EntityFrameworkCore.Sqlite` to connect to the SQLite database.
- The database path is resolved relative to the API project so the app can find `books.db` in the root project folder.

## Backend API

The starter weather forecast code was removed and replaced with a bookstore endpoint in `Program.cs`.

### Endpoint created

- `GET /books`

### Query parameters supported

- `pageSize`
  - Controls how many books to show per page.
- `pageNum`
  - Controls which page of results to return.
- `sortOrder`
  - Supports `asc` or `desc` for sorting by title.

### What the endpoint does

- Connects to the SQLite database.
- Reads books from the `Books` table.
- Sorts the books by `Title`.
- Applies pagination with `Skip()` and `Take()`.
- Returns both the current page of books and pagination metadata.

### Response data includes

- The books for the requested page.
- Total number of books.
- Current page number.
- Page size.
- Total number of pages.
- Current sort order.

This approach makes the pagination dynamic because the API calculates the total number of pages based on however many books are currently in the database.

## Frontend React App

The default Vite starter content was completely replaced with a bookstore page in `bookstore-client/src/App.tsx`.

### Main frontend features

- Fetches book data from the ASP.NET Core API.
- Displays all book information in a table.
- Shows 5 books per page by default.
- Lets the user change the number of results per page.
- Lets the user sort titles from A to Z or Z to A.
- Builds the page number buttons dynamically based on the total number of pages returned by the API.

### State handled in React

- `books`
- `currentPage`
- `pageSize`
- `sortOrder`
- `totalPages`
- `totalBooks`
- `isLoading`
- `error`

### How pagination works in the frontend

Whenever the user changes the page number, page size, or sort order, the app sends a new request to the API. The API returns the correct slice of data plus the total number of pages. React then builds the pagination controls by creating buttons from page 1 through the last page.

That means the pagination is not hard-coded. It automatically adapts to the amount of data in the database and the page size selected by the user.

## Bootstrap Styling

Bootstrap was added to the React project and imported in `src/main.tsx`.

### Bootstrap is used for

- The overall layout container
- The card layout
- Form controls
- The table
- Alerts
- Responsive spacing
- Pagination controls

Custom CSS was also added in `src/App.css` and `src/index.css` to give the page a more polished bookstore-style appearance while still clearly using Bootstrap for the assignment requirement.

## Additional Configuration

### CORS

Because the React frontend and ASP.NET Core API run on different local ports during development, I added a CORS policy in the API so the frontend can call the backend successfully from `http://localhost:5173`.

### Launch settings

I updated the API launch settings so it runs on a fixed port:

- `http://localhost:5033`

This makes it easier for the React app to know where to fetch data from.

## Files Updated

### Backend

- `BookstoreApi/BookstoreApi.csproj`
- `BookstoreApi/Program.cs`
- `BookstoreApi/Properties/launchSettings.json`
- `BookstoreApi/BookstoreApi.http`
- `BookstoreApi/Models/Book.cs`
- `BookstoreApi/Data/BookstoreContext.cs`

### Frontend

- `bookstore-client/package.json`
- `bookstore-client/src/main.tsx`
- `bookstore-client/src/App.tsx`
- `bookstore-client/src/App.css`
- `bookstore-client/src/index.css`

### Root

- `MISSION11_EXPLANATION.md`
- `books.db`
- `Mission11_Carr.sln`

## How to Run the Project

### Backend

1. Open a terminal in `BookstoreApi`
2. Run:

```bash
dotnet run
```

The API will start on:

```text
http://localhost:5033
```

### Frontend

1. Open a second terminal in `bookstore-client`
2. Run:

```bash
npm install
npm run dev
```

The frontend will start on:

```text
http://localhost:5173
```

## Verification Completed

I verified the following successfully:

- The SQLite database file was downloaded and inspected.
- The database schema matches the model fields in the API.
- The ASP.NET Core project restores and builds successfully.
- The React project installs dependencies and builds successfully.

### Build commands used

```bash
cd BookstoreApi
dotnet restore
dotnet build

cd ../bookstore-client
npm install
npm run build
```

## Assignment Rubric Coverage

### Program Runs Without Error

Both projects build successfully.

### Models Match Database

The `Book` model matches the `Books` table fields from the SQLite database.

### App Lists Books

The frontend fetches and displays all books from the database through the API.

### App Contains Dynamic Pagination

Pagination is generated dynamically from the total number of books and the selected page size.

### App Allows User to Sort Books

The user can sort books by title in ascending or descending order.

### App is Styled with Bootstrap

Bootstrap is installed and used throughout the UI.

### Code is Clean

The project uses clear names, separated concerns, and organized backend/frontend files for readability.
