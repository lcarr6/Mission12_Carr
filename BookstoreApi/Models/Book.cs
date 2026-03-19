using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookstoreApi.Models;

// This class maps directly to the Books table in the SQLite database.
[Table("Books")]
public class Book
{
    // BookID is the primary key column in the database.
    [Key]
    public int BookID { get; set; }

    // The rest of the properties match the required assignment fields.
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Author { get; set; } = string.Empty;

    [Required]
    public string Publisher { get; set; } = string.Empty;

    [Required]
    public string ISBN { get; set; } = string.Empty;

    [Required]
    public string Classification { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    [Required]
    public int PageCount { get; set; }

    // SQLite stores decimal-style values with REAL in this database.
    [Required]
    [Column(TypeName = "REAL")]
    public double Price { get; set; }
}
