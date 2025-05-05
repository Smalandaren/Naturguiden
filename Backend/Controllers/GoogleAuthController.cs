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
    private readonly IConfiguration _configuration; // Behövs för att hämta vår frontend-adress från appsettings.json

    public GoogleAuthController(AuthService authService, IConfiguration configuration)
    {
        _authService = authService;
        _configuration = configuration;
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
            await HttpContext.SignOutAsync();
            return Redirect($"{_configuration["Frontend:BaseUrl"]}?authError=GoogleLoginFailed");
        }

        var externalPrincipal = result.Principal;

        var email = externalPrincipal?.FindFirst(ClaimTypes.Email)?.Value;
        var googleId = externalPrincipal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var firstName = externalPrincipal?.FindFirst(ClaimTypes.GivenName)?.Value;
        var lastName = externalPrincipal?.FindFirst(ClaimTypes.Surname)?.Value;

        if (email == null || googleId == null || firstName == null || lastName == null)
        {
            // Något gick fel, all nödvändig data för inloggning mottogs ej från Google
            await HttpContext.SignOutAsync();
            return Redirect($"{_configuration["Frontend:BaseUrl"]}?authError=GoogleLoginFailed");
        }
        else
        {
            try
            {
                User? user = await _authService.AuthenticateOAuthAsync("google", googleId, email, firstName, lastName);
                if (user == null)
                {
                    // Detta är kanske en ful lösning!
                    // Om AuthenticateGoogleAsync returnerar null så betyder det att
                    // Google-kontons epost redan finns i databasen, fast inte som ett Google konto
                    await HttpContext.SignOutAsync();
                    return Redirect($"{_configuration["Frontend:BaseUrl"]}?authError=GoogleEmailBelongsToExistingAccount");
                }
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
                return Redirect($"{_configuration["Frontend:BaseUrl"]}?authError=GoogleLoginFailed");
            }
        }

        return Redirect($"{_configuration["Frontend:BaseUrl"]}");
    }

    [HttpGet("GoogleLoginDeniedByUser")]
    public IActionResult GoogleLoginDeniedByUser()
    {
        return Redirect($"{_configuration["Frontend:BaseUrl"]}?authError=GoogleLoginDeniedByUser");
    }

}