using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace NaturguidenServerPrototype.Services;

public class AuthService
{
    private readonly ApplicationDbContext _context;

    public AuthService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> AuthenticateAsync(string email, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user != null && user.PasswordHash != null && user.Provider == "local") // logga endast in "local" användare via denna metod
        {
            if (VerifyPassword(password, user.PasswordHash))
            {
                return user;
            }
        }
        return null;
    }

    public Boolean VerifyPassword(string inputPassword, string passwordHash)
    {
        if (SecretHasher.Verify(inputPassword, passwordHash))
        {
            return true;
        }
        return false;
    }

    public async Task<User?> RegisterAsync(string email, string password, string firstName, string lastName)
    {
        var existingUser = await _context.Users.AnyAsync(u => u.Email == email);
        if (existingUser)
        {
            return null;
        }

        var hashedPassword = SecretHasher.Hash(password);

        var newUser = new User
        {
            Email = email,
            PasswordHash = hashedPassword,
            FirstName = firstName,
            LastName = lastName,
            Provider = "local" // "local" används för konton som är registerade med email/pwd. För auth med t.ex Google hade här stått "google"
        };

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return newUser;
    }

    public async Task<User> AuthenticateGoogleAsync(string googleId, string email, string firstName, string lastName)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.Provider == "google");
        if (user != null)
        {
            // Användaren finns redan och har loggat in med Google tidigare
            return user;
        }
        else
        {
            var newUser = new User
            {
                Email = email,
                PasswordHash = null,
                FirstName = firstName,
                LastName = lastName,
                Provider = "google",
                ProviderId = googleId
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser;
        }
    }

}