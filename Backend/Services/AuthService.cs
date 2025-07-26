using GreenBooksAPI.Data;

using GreenBooksAPI.Model;
using Dapper;

namespace GreenBooksAPI.Services;

public class AuthService : IAuthService
{
    private readonly DapperContext _context;

    public AuthService(DapperContext context)
    {
        _context = context;
    }

    public async Task<string?> RegisterAsync(RegisterRequest req)
    {
        using var conn = _context.CreateConnection();

        var existingEmail = await conn.ExecuteScalarAsync<int>(
            "SELECT COUNT(*) FROM users WHERE email = @Email", new { req.Email });

        if (existingEmail > 0)
            return "Email mevcut!";

        var existingUsername = await conn.ExecuteScalarAsync<int>(
            "SELECT COUNT(*) FROM users WHERE username = @Username", new { req.Username });

        if (existingUsername > 0)
            return "Kullanıcı adı mevcut !";

        var hash = BCrypt.Net.BCrypt.HashPassword(req.Password);

        var sql = @"INSERT INTO users 
                (username, email, password_hash, name, surname, phone_number, created_time)
                VALUES 
                (@Username, @Email, @PasswordHash, @FirstName, @LastName,@PhoneNumber ,@CreatedAt)";

        await conn.ExecuteAsync(sql, new
        {
            req.Username,
            req.Email,
            PasswordHash = hash,
            req.FirstName,
            req.LastName,
            req.PhoneNumber,
            CreatedAt = DateTime.UtcNow
        });

        return null; 
    }



    public async Task<LoginResponse?> LoginAsync(LoginRequest req)
    {
        using var conn = _context.CreateConnection();

        var user = await conn.QueryFirstOrDefaultAsync<User>(
            @"SELECT userid, username, email,isAdmin, password_hash AS PasswordHash, 
                 name AS FirstName, surname AS LastName , phone_number AS PhoneNumber
          FROM users 
          WHERE username = @Username", new { req.Username });

        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return null;

        return new LoginResponse
        {
            Id = user.UserId,
            Username = user.Username,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber= user.PhoneNumber,
            isAdmin=user.isAdmin,
        };
    }




}

