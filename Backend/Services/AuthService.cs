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
        if (user != null && user.PasswordHash != null)
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
        if (inputPassword == passwordHash)
        {
            return true;
        }
        return false;
    }

}