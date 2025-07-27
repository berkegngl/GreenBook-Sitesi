using GreenBooksAPI.Services;
using Microsoft.AspNetCore.Mvc;
using GreenBooksAPI.Model;

namespace GreenBooksAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth)
    {
        _auth = auth;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest req)
    {
        Console.WriteLine($"[CONTROLLER] Register request received for username: {req.Username}");
        Console.WriteLine($"[CONTROLLER] Request data: Username={req.Username}, Email={req.Email}, FirstName={req.FirstName}, LastName={req.LastName}, PhoneNumber={req.PhoneNumber}");
        
        try
        {
            var result = await _auth.RegisterAsync(req);

            if (result != null)
            {
                Console.WriteLine($"[CONTROLLER] Registration failed: {result}");
                return BadRequest(new { message = result, success = false });
            }

            Console.WriteLine("[CONTROLLER] Registration successful");
            return Ok(new { message = "User registered", success = true });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[CONTROLLER] Exception during registration: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var user = await _auth.LoginAsync(req);

        if (user == null)
            return Unauthorized("Invalid credentials");

        Console.WriteLine($"Login başarılı: {user.Username} (ID: {user.Id})");

        return Ok(user);
    }

}

