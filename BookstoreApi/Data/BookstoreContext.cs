using BookstoreApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookstoreApi.Data;

// The DbContext is EF Core's main bridge between our C# code and the database.
public class BookstoreContext(DbContextOptions<BookstoreContext> options) : DbContext(options)
{
    // This property represents the Books table and lets us query it with LINQ.
    public DbSet<Book> Books => Set<Book>();
}
