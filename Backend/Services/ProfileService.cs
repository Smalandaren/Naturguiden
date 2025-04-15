using Microsoft.EntityFrameworkCore;
using Backend.Data;

public class ProfileService
{
    private readonly ApplicationDbContext _context;

    public ProfileService(ApplicationDbContext context)
    {
        _context = context;
    }

    // Returnerar enkel information om en användare, se ProfileBasicsDTO för innehållet
    public async Task<ProfileBasicsDTO?> GetBasicProfileInfoAsync(int id)
    {
        var user = await _context.Users.Where(u => u.Id == id).FirstOrDefaultAsync();
        if (user != null)
        {
            var profileBasicsDTO = new ProfileBasicsDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                CreatedAt = user.CreatedTimestamp
            };

            return profileBasicsDTO;
        }
        return null;
    }

}