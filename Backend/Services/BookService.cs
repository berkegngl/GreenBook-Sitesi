using Dapper;
using GreenBooksAPI.Data;
using GreenBooksAPI.Model;

namespace GreenBooksAPI.Services
{
    public class BookService : IBookService
    {
        private readonly DapperContext _context;

        public BookService(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Book>> GetBestsellersAsync()
        {
            var sql = "SELECT * FROM books WHERE bestseller = 1";

            using var conn = _context.CreateConnection();
            var books = await conn.QueryAsync<Book>(sql);
            return books;
        }

        public async Task<IEnumerable<Book>> GetBooksByCategoryAsync(string category)
        {
            var sql = "SELECT * FROM books WHERE category = @Category";

            using var conn = _context.CreateConnection();
            var books = await conn.QueryAsync<Book>(sql, new { Category = category });

            return books;
        }

        public async Task<IEnumerable<Book>> GetBooksByCategoryandSubcategoryAsync(string category,string subcategory)
        {
            var sql = "SELECT * FROM books WHERE category = @Category and subcategory = @Subcategory";

            using var conn = _context.CreateConnection();
            var books = await conn.QueryAsync<Book>(sql, new { Category = category , Subcategory= subcategory });

            return books;
        }

        public async Task<IEnumerable<Book>> GetDiscountedBooksAsync()
        {
            var sql = "SELECT * FROM books WHERE discount_rate > 0";

            using var conn = _context.CreateConnection();
            var books = await conn.QueryAsync<Book>(sql);
            return books;
        }

    }
}
