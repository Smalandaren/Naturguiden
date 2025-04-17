using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using NaturguidenServerPrototype.Services;

namespace NaturguidenServerPrototype.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [Authorize]
    [HttpGet("check-auth")]
    public IActionResult CheckAuth()
    {
        // Endast autentiserade användare kan nå den här punkten
        return Ok(new { Message = "User is authenticated and authorized" });
    }

    [UnauthorizedOnly]
    [HttpPost("log-in")]
    public async Task<IActionResult> Login([FromBody] LoginRequest login)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _authService.AuthenticateAsync(login.Email, login.Password);

        if (user == null)
        {
            return Unauthorized(new { Message = "Invalid email or password" });
        }

        // En korrekt kombination av email + lösenord har mottagits, nu ska användaren loggas in (dvs få en cookie)
        var claims = new List<Claim> {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()) // Koppla användarens ID till sessionen (cookien)
        };
        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsPrincipal); // Skapa sessionen
        return Ok(new { Message = "Login successful" });
    }

    [UnauthorizedOnly]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest register)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _authService.RegisterAsync(register.Email, register.Password, register.FirstName, register.LastName);

        if (user == null)
        {
            return Conflict(new { Message = "A user with this email already exists." });
        }

        return Ok(new { Message = "Registration successful" });
    }

    [Authorize]
    [HttpPost("log-out")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        return Ok(new { Message = "Logout successful" });
    }
}