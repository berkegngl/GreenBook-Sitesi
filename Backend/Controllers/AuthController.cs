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
        var result = await _auth.RegisterAsync(req);

        if (result != null)
            return BadRequest(result);

        return Ok("User registered");
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

