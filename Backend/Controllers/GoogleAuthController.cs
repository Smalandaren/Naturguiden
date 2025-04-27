using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using NaturguidenServerPrototype.Services;
using Backend.Models;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace NaturguidenServerPrototype.Controllers;

[ApiController]
[Route("api/[controller]")]

public class GoogleAuthController : ControllerBase
{
    private readonly AuthService _authService;

    public GoogleAuthController(AuthService authService)
    {
        _authService = authService;
    }

    // Man kan tycka att detta borde vara en POST route men inte enl Google: https://developers.google.com/identity/oauth2/web/guides/use-code-model
    [HttpGet("log-in")]
    public IActionResult GoogleLogin()
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = "/api/GoogleAuth/callback"
        };

        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    // Man kan tycka att detta borde vara en POST route men inte enl Google: https://developers.google.com/identity/oauth2/web/guides/use-code-model
    [HttpGet("callback")]
    public async Task<IActionResult> GoogleCallback()
    {
        var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

        if (!result.Succeeded)
        {
            await HttpContext.SignOutAsync(GoogleDefaults.AuthenticationScheme);
            return Redirect("https://localhost:3000?authError=GoogleLoginFailed");
        }

        var externalPrincipal = result.Principal;

        var email = externalPrincipal?.FindFirst(ClaimTypes.Email)?.Value;
        var googleId = externalPrincipal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var firstName = externalPrincipal?.FindFirst(ClaimTypes.GivenName)?.Value;
        var lastName = externalPrincipal?.FindFirst(ClaimTypes.Surname)?.Value;

        Console.WriteLine($"Logged in with Google! Email: {email}, Google ID: {googleId}, First name: {firstName}, Last name: {lastName}");

        if (email != null && googleId != null && firstName != null && lastName != null)
        {
            try
            {
                User user = await _authService.AuthenticateGoogleAsync(googleId, email, firstName, lastName);
                var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };
                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsPrincipal);
            }
            catch (Exception)
            {
                return Redirect("https://localhost:3000?authError=GoogleLoginFailed");
            }
        }
        else
        {
            // Något gick fel, all nödvändig data för inloggning mottogs ej från Google
            await HttpContext.SignOutAsync(GoogleDefaults.AuthenticationScheme);
            return Redirect("https://localhost:3000?authError=GoogleLoginFailed");
        }

        return Redirect("https://localhost:3000");
    }

}