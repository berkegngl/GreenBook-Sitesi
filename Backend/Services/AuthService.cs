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
        Console.WriteLine($"[AUTH] Register attempt for username: {req.Username}, email: {req.Email}");
        
        try
        {
            using var conn = _context.CreateConnection();
            Console.WriteLine("[AUTH] Database connection created successfully");

            var existingEmail = await conn.ExecuteScalarAsync<int>(
                "SELECT COUNT(*) FROM users WHERE email = @Email", new { req.Email });

            Console.WriteLine($"[AUTH] Existing email check result: {existingEmail}");

            if (existingEmail > 0)
            {
                Console.WriteLine("[AUTH] Email already exists");
                return "Email mevcut!";
            }

            var existingUsername = await conn.ExecuteScalarAsync<int>(
                "SELECT COUNT(*) FROM users WHERE username = @Username", new { req.Username });

            Console.WriteLine($"[AUTH] Existing username check result: {existingUsername}");

            if (existingUsername > 0)
            {
                Console.WriteLine("[AUTH] Username already exists");
                return "Kullanıcı adı mevcut !";
            }

            var hash = BCrypt.Net.BCrypt.HashPassword(req.Password);
            Console.WriteLine("[AUTH] Password hashed successfully");

            var sql = @"INSERT INTO users 
                    (username, email, password_hash, name, surname, phone_number, created_time)
                    VALUES 
                    (@Username, @Email, @PasswordHash, @FirstName, @LastName,@PhoneNumber ,@CreatedAt)";

            Console.WriteLine("[AUTH] Executing INSERT query...");
            
            var result = await conn.ExecuteAsync(sql, new
            {
                req.Username,
                req.Email,
                PasswordHash = hash,
                req.FirstName,
                req.LastName,
                req.PhoneNumber,
                CreatedAt = DateTime.UtcNow
            });

            Console.WriteLine($"[AUTH] INSERT query executed successfully. Rows affected: {result}");
            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[AUTH] Error during registration: {ex.Message}");
            Console.WriteLine($"[AUTH] Stack trace: {ex.StackTrace}");
            throw;
        }
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

