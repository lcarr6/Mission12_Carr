using BookstoreApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var databasePath = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, "..", "books.db"));

builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite($"Data Source={databasePath}"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("BookstoreClient", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("BookstoreClient");

app.MapGet("/books", async (
    BookstoreContext db,
    int pageSize = 5,
    int pageNum = 1,
    string sortOrder = "asc") =>
{
    var normalizedPageSize = pageSize < 1 ? 5 : pageSize;
    var normalizedPageNum = pageNum < 1 ? 1 : pageNum;
    var normalizedSort = sortOrder.Equals("desc", StringComparison.OrdinalIgnoreCase)
        ? "desc"
        : "asc";

    var query = db.Books.AsNoTracking();

    query = normalizedSort == "desc"
        ? query.OrderByDescending(book => book.Title)
        : query.OrderBy(book => book.Title);

    var totalBooks = await query.CountAsync();
    var books = await query
        .Skip((normalizedPageNum - 1) * normalizedPageSize)
        .Take(normalizedPageSize)
        .ToListAsync();

    return Results.Ok(new
    {
        books,
        pagination = new
        {
            totalBooks,
            pageSize = normalizedPageSize,
            currentPage = normalizedPageNum,
            totalPages = (int)Math.Ceiling(totalBooks / (double)normalizedPageSize),
            sortOrder = normalizedSort
        }
    });
})
.WithName("GetBooks");

app.Run();
