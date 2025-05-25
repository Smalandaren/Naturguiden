using Backend.Models;

namespace Backend.Interfaces
{
    public interface IAuthService
    {
        Task<User?> AuthenticateAsync(string email, string password);
        bool VerifyPassword(string inputPassword, string passwordHash);
        Task<User?> RegisterAsync(string email, string password, string firstName, string lastName);
        Task<User?> AuthenticateOAuthAsync(string provider, string providerId, string email, string firstName, string lastName);
    }
}
