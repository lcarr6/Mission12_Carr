using BookstoreApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// The SQLite database file lives in the root folder of the assignment,
// so we build an absolute path from the API project's current location.
var databasePath = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, "..", "books.db"));

// Register the EF Core database context so the API can query the Books table.
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite($"Data Source={databasePath}"));

// React runs on a different localhost port, so CORS is needed during development.
builder.Services.AddCors(options =>
{
    options.AddPolicy("BookstoreClient", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddOpenApi();

var app = builder.Build();

// OpenAPI is only exposed in development.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("BookstoreClient");

// This endpoint powers the React bookstore page.
// It supports page size changes, page navigation, title sorting, and category filtering.
app.MapGet("/books", async (
    BookstoreContext db,
    int pageSize = 5,
    int pageNum = 1,
    string sortOrder = "asc",
    string? category = null) =>
{
    // Defensive defaults keep the query valid even if bad values are passed in.
    var normalizedPageSize = pageSize < 1 ? 5 : pageSize;
    var normalizedPageNum = pageNum < 1 ? 1 : pageNum;
    var normalizedSort = sortOrder.Equals("desc", StringComparison.OrdinalIgnoreCase)
        ? "desc"
        : "asc";

    // AsNoTracking improves read-only query performance because we are not editing books here.
    var query = db.Books.AsNoTracking();

    // Filter by category if a category is provided
    if (!string.IsNullOrWhiteSpace(category))
    {
        // Case-insensitive comparison for SQLite
        query = query.Where(b => b.Category.ToLower() == category.ToLower());
    }

    // Sorting happens before pagination so each page is based on the correct overall order.
    query = normalizedSort == "desc"
        ? query.OrderByDescending(book => book.Title)
        : query.OrderBy(book => book.Title);

    // CountAsync gives the frontend enough information to build page buttons dynamically.
    var totalBooks = await query.CountAsync();

    // Skip moves past the earlier pages, then Take pulls only the current page of results.
    var books = await query
        .Skip((normalizedPageNum - 1) * normalizedPageSize)
        .Take(normalizedPageSize)
        .ToListAsync();

    // Return both the books and the pagination metadata the React app needs.
    return Results.Ok(new
    {
        books,
        pagination = new
        {
            totalBooks,
            pageSize = normalizedPageSize,
            currentPage = normalizedPageNum,
            totalPages = (int)Math.Ceiling(totalBooks / (double)normalizedPageSize),
            sortOrder = normalizedSort,
            category
        }
    });
})
.WithName("GetBooks");

// New endpoint to dynamically fetch all distinct categories
app.MapGet("/categories", async (BookstoreContext db) =>
{
    var categories = await db.Books
        .Select(b => b.Category)
        .Distinct()
        .OrderBy(c => c)
        .ToListAsync();

    return Results.Ok(categories);
})
.WithName("GetCategories");

app.Run();
