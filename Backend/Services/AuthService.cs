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
        User? user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
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
        bool existingUser = await _context.Users.AnyAsync(u => u.Email == email);
        if (existingUser)
        {
            return null;
        }

        string hashedPassword = SecretHasher.Hash(password);

        User newUser = new User
        {
            Email = email,
            PasswordHash = hashedPassword,
            FirstName = firstName,
            LastName = lastName,
            Provider = "local", // "local" används för konton som är registerade med email/pwd. För auth med t.ex Google hade här stått "google"
            IsAdmin = false
        };

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return newUser;
    }

    public async Task<User?> AuthenticateOAuthAsync(string provider, string providerId, string email, string firstName, string lastName)
    {
        try
        {
            User? user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user != null && user.Provider == provider)
            {
                // Användaren finns redan och har loggat in med den relevanta providern, typ Google, tidigare
                return user;
            }

            if (user != null && user.Provider != provider)
            {
                // E-postadressen finns redan men tillhör inte den relevanta providern, typ Google
                return null;
            }

            // Om inga av fallen ovan stämmer så skapas en ny användare med den relevanta providern, typ Google
            User newUser = new User
            {
                Email = email,
                PasswordHash = null,
                FirstName = firstName,
                LastName = lastName,
                Provider = provider,
                ProviderId = providerId,
                IsAdmin = false
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser;
        }
        catch (Exception)
        {
            return null;
        }
    }
}