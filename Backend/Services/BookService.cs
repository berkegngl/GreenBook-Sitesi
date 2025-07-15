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

        public async Task<IEnumerable<Book>> GetAllBooksAsync()
        {

            var sql = " SELECT * FROM books";

            using var conn = _context.CreateConnection();
            var books = await conn.QueryAsync<Book>(sql);

            return books;



        }

        public async Task<IEnumerable<GeneralResponse>> General()
        {

            var sql = @"
                 SELECT 
                    (SELECT COUNT(*) FROM users) AS total_users,
                    (SELECT COUNT(*) FROM books) AS total_books;
                                                                    ";


            using var conn = _context.CreateConnection();
            var counts = await conn.QueryAsync<GeneralResponse>(sql);

            return counts;



        }


        public async Task<IEnumerable<Book>> FilterBooksAsync(string? category, string? subcategory, string? author, string? publisher)
        {
            var sql = "SELECT * FROM books WHERE 1=1";
            var parameters = new DynamicParameters();

            if (!string.IsNullOrWhiteSpace(category))
            {
                sql += " AND category = @category";
                parameters.Add("category", category);
            }

            if (!string.IsNullOrWhiteSpace(subcategory))
            {
                sql += " AND subcategory = @subcategory";
                parameters.Add("subcategory", subcategory);
            }

            if (!string.IsNullOrWhiteSpace(author))
            {
                sql += " AND author = @author";
                parameters.Add("author", author);
            }

            if (!string.IsNullOrWhiteSpace(publisher))
            {
                sql += " AND publisher = @publisher";
                parameters.Add("publisher", publisher);
            }

            using var conn = _context.CreateConnection();
            return await conn.QueryAsync<Book>(sql, parameters);
        }

        public async Task<IEnumerable<Book>> SearchBooksAsync(string query)
        {
            var sql = @"
        SELECT * FROM books
        WHERE LOWER(title) LIKE LOWER(@query)
           OR LOWER(author) LIKE LOWER(@query)
           OR LOWER(publisher) LIKE LOWER(@query)";

            using var conn = _context.CreateConnection();
            return await conn.QueryAsync<Book>(sql, new { query = $"%{query}%" });
        }



    }
}
