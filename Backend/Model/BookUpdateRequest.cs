namespace GreenBooksAPI.Model;

public class BookUpdateRequest
{
    public int Id { get; set; } 
    public string? Title { get; set; } 
    public string? Author { get; set; } 
    public decimal? Price { get; set; } 
    public string? Image { get; set; } 
    public string? Description { get; set; } 
    public string? Category { get; set; }  
    public string? Subcategory { get; set; } 
    public string? Publisher { get; set; } 
    public int? DiscountRate { get; set; } 
    public int? Bestseller { get; set; }  
}

