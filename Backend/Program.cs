using Backend.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using NaturguidenServerPrototype.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    EnvironmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5112); // HTTP port
    options.ListenLocalhost(7055, listenOptions =>
    {
        listenOptions.UseHttps(); // Enables HTTPS on port 7055
    });
});

// CORS konfiguration. Krävs för att kommunikation mellan webbläsare och API ska fungera
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "https://localhost:3000") // Vår front-end måste finnas på denna adressen
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
builder.Services.AddScoped<PlacesService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ProfileService>();
builder.Services.AddScoped<VisitsService>();
builder.Services.AddScoped<SearchService>();

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
}).AddGoogle(options =>
{
    options.ClientId = "698761536465-nm4jtj1nb4oadfiginkcls1597dv6bni.apps.googleusercontent.com";
    options.ClientSecret = "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";
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger(options =>
    {
        options.RouteTemplate = "/openapi/{documentName}.json";
    });
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();