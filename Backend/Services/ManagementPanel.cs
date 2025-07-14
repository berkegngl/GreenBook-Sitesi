using GreenBooksAPI.Data;
using GreenBooksAPI.Model;
using Dapper;
using System.Text;

namespace GreenBooksAPI.Services;

public class ManagementPanel: IManagementPanel
{


    private readonly DapperContext _context;

    public ManagementPanel(DapperContext context)
    {
        _context = context;


    }



    public async Task<int> AddBookAsync(BookManagement book)
    {
        var sql = @"INSERT INTO books 
        (title, author, price, image, description, category, subcategory, publisher, discount_rate, bestseller)
        VALUES 
        (@Title, @Author, @Price, @Image, @Description, @Category, @Subcategory, @Publisher, @Discount_Rate, @Bestseller)";

        using var conn = _context.CreateConnection();

        

        return await conn.ExecuteAsync(sql, book);
    }


    public async Task<int> UpdateBookAsync(BookUpdateRequest book)
    {
        var sqlBuilder = new StringBuilder("UPDATE books SET ");
        var parameters = new DynamicParameters();

        void AppendIfNotNull<T>(string column, T? value)
        {
            if (value != null)
            {
                if (parameters.ParameterNames.Any()) sqlBuilder.Append(", ");
                sqlBuilder.Append($"{column} = @{column}");
                parameters.Add(column, value);
            }
        }

        AppendIfNotNull("title", book.Title);
        AppendIfNotNull("author", book.Author);
        AppendIfNotNull("price", book.Price);
        AppendIfNotNull("image", book.Image);
        AppendIfNotNull("description", book.Description);
        AppendIfNotNull("category", book.Category);
        AppendIfNotNull("subcategory", book.Subcategory);
        AppendIfNotNull("publisher", book.Publisher);
        AppendIfNotNull("discount_rate", book.DiscountRate);
        AppendIfNotNull("bestseller", book.Bestseller);

        sqlBuilder.Append(" WHERE id = @Id");
        parameters.Add("Id", book.Id);

        using var conn = _context.CreateConnection();
        return await conn.ExecuteAsync(sqlBuilder.ToString(), parameters);
    }


    public async Task<int> DeleteBookAsync(int id)
    {
        var sql = "DELETE FROM books WHERE id = @Id";

        using var conn = _context.CreateConnection();
        return await conn.ExecuteAsync(sql, new { Id = id });
    }


}
