using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Backend.Interfaces;
using Backend.Models;

namespace NaturguidenServerPrototype.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IProfileService _profileService;

    public AuthController(IAuthService authService, IProfileService profileService)
    {
        _authService = authService;
        _profileService = profileService;
    }

    [Authorize]
    [HttpGet("check-auth")]
    public async Task<ActionResult<AuthCheckResponse>> CheckAuth()
    {
        // Endast autentiserade användare kan nå den här punkten
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId)) // Variabeln userId skapas bara om userIdString går att omvandla till en int
        {
            return Unauthorized("Invalid user id");
        }

        var profileInfo = await _profileService.GetBasicProfileInfoAsync(userId);
        bool isAdmin = await _profileService.GetUserAdminStatusAsync(userId);
        var response = new AuthCheckResponse
        {
            Authenticated = true,
            User = profileInfo,
            IsAdmin = isAdmin ? true : null
        };
        return Ok(response);
    }

    [UnauthorizedOnly]
    [HttpPost("log-in")]
    public async Task<IActionResult> Login([FromBody] LoginRequest login)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (!EmailValidator.IsValidEmail(login.Email))
        {
            return BadRequest(new { message = "Invalid email format" });
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

        if (!EmailValidator.IsValidEmail(register.Email))
        {
            return BadRequest(new { message = "Invalid email format" });
        }

        if (register.FirstName.Length > 25 || register.LastName.Length > 40)
        {
            return BadRequest("Invalid name");
        }

        var user = await _authService.RegisterAsync(register.Email, register.Password, register.FirstName, register.LastName);

        if (user == null)
        {
            return Conflict(new { Message = "A user with this email already exists." });
        }

        // Logga in användaren efter lyckad registrering
        var claims = new List<Claim> {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()) // Koppla användarens ID till sessionen (cookien)
        };
        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsPrincipal); // Skapa sessionen
        return Ok(new { Message = "Registration successful" });
    }

    [Authorize]
    [HttpPost("log-out")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        return Ok(new { Message = "Logout successful" });
    }

    [Authorize]
    [HttpGet("can-change-password")]
    public async Task<ActionResult<CanChangePasswordResponse>> CanChangePassword()
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Endast autentiserade användare kan nå den här punkten
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId)) // Variabeln userId skapas bara om userIdString går att omvandla till en int
        {
            return Unauthorized("Invalid user id");
        }

        var profileInfo = await _profileService.GetBasicProfileInfoAsync(userId);
        if (profileInfo == null)
        {
            return NotFound();
        }
        if (profileInfo.Provider == "local")
        {
            return Ok(new { canChangePassword = true });
        }
        else
        {
            return StatusCode(403, new { canChangePassword = false });

        }
    }

    [Authorize]
    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Endast autentiserade användare kan nå den här punkten
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId)) // Variabeln userId skapas bara om userIdString går att omvandla till en int
        {
            return Unauthorized("Invalid user id");
        }

        User? user = await _authService.AuthenticateAsync(userId, request.CurrentPassword);
        if (user == null)
        {
            return Unauthorized(new { Message = "Invalid current password" });
        }

        bool passwordChange = await _authService.UpdatePasswordAsync(userId, request.NewPassword);

        if (passwordChange == true)
        {
            return Ok(new { message = "Password changed" });
        }
        else
        {
            return StatusCode(500, "Could not change password");
        }
    }
}