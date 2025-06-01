using System.Diagnostics;
using Backend.Data;
using Backend.Interfaces;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using NaturguidenServerPrototype.Services;
using Scalar.AspNetCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    EnvironmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5112); // HTTP port
    /*options.ListenAnyIP(7055, listenOptions =>
    {
        listenOptions.UseHttps(); // Enables HTTPS on port 7055
    });*/
});

// CORS konfiguration. Krävs för att kommunikation mellan webbläsare och API ska fungera
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "https://localhost:3000", "https://naturguiden.net", "http://naturguiden.net") // Vår front-end måste finnas på denna adressen
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Förutsättning för kommunikation med DB
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registrera våra egna services
builder.Services.AddScoped<IPlacesService, PlacesService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<VisitsService>();
builder.Services.AddScoped<SearchService>();
builder.Services.AddScoped<AnnouncementBannerService>();
builder.Services.AddScoped<FriendsService>();
builder.Services.AddScoped<ReviewService>();
builder.Services.AddScoped<WishlistService>();


// Registrera cookie autentisering
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
{
    options.Cookie.Name = "NaturguidenCookie";
    options.Events.OnRedirectToAccessDenied =
    options.Events.OnRedirectToLogin = c =>
    {
        c.Response.StatusCode = StatusCodes.Status401Unauthorized;
        c.Response.ContentType = "application/json";
        return c.Response.WriteAsJsonAsync(new AuthCheckResponse
        {
            Authenticated = false
        });
    };
});

// Google autentisering registreras bara om man har lagt till credentials i sin appsettings.dev.json (eller enviroment variable)
var googleClientId = builder.Configuration["Authentication:Google:ClientId"];
var googleClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];

if (!string.IsNullOrWhiteSpace(googleClientId) && !string.IsNullOrWhiteSpace(googleClientSecret))
{
    builder.Services.AddAuthentication()
        .AddGoogle(options =>
        {
            options.AccessDeniedPath = "/api/GoogleAuth/GoogleLoginDeniedByUser";
            options.ClientId = googleClientId;
            options.ClientSecret = googleClientSecret;
        });
}
else
{
    CustomConsoleLog.Log(CustomConsoleLog.Types.CriticalError, "Google auth not possible due to missing credentials. Make sure you have entered the ClientId and ClientSecret in either appsettings.dev.json or in your enviroment variables");
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger(options =>
    {
        options.RouteTemplate = "/openapi/{documentName}.json";
    });
    app.MapScalarApiReference();
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads")),
    RequestPath = "/uploads"
});

app.UseHttpsRedirection();

app.UseCors();

app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();