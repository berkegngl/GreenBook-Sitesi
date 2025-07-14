using GreenBooksAPI.Model;

namespace GreenBooksAPI.Services;

public interface IManagementPanel
{

    Task<int> AddBookAsync(BookManagement book);
    Task<int> UpdateBookAsync(BookUpdateRequest book);
    Task<int> DeleteBookAsync(int id);

}
