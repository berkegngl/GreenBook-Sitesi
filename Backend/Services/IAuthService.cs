
using GreenBooksAPI.Model;

namespace GreenBooksAPI.Services;

public interface IAuthService
{
    Task<string?> RegisterAsync(RegisterRequest req);
    Task<LoginResponse?> LoginAsync(LoginRequest req);


}

