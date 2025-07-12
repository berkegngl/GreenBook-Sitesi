using GreenBooksAPI.Model;

namespace GreenBooksAPI.Services
{
    public interface IBookService
    {
        Task<IEnumerable<Book>> GetBestsellersAsync();
        Task<IEnumerable<Book>> GetBooksByCategoryAsync(string category);

        Task<IEnumerable<Book>> GetBooksByCategoryandSubcategoryAsync(string category,string subcategory);

        Task<IEnumerable<Book>> GetDiscountedBooksAsync();

        Task<IEnumerable<Book>> GetAllBooksAsync();

        Task<IEnumerable<Book>> FilterBooksAsync(string? category, string? subcategory, string? author, string? publisher);

        Task<IEnumerable<Book>> SearchBooksAsync(string query);

    }
}
