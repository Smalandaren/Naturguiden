using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

public class ProfileService
{
    private readonly ApplicationDbContext _context;
    private readonly PlacesService _placesService;

    public ProfileService(ApplicationDbContext context, PlacesService placesService)
    {
        _context = context;
        _placesService = placesService;
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
                Provider = user.Provider,
                CreatedAt = user.CreatedTimestamp
            };

            return profileBasicsDTO;
        }
        return null;
    }

    public async Task<List<FullProfileDTO>> GetAllProfilesAsync()
    {
        List<User> users = await _context.Users.OrderByDescending(u => u.CreatedTimestamp).ToListAsync();

        var result = new List<FullProfileDTO>();

        foreach (var u in users)
        {
            var fullProfileDTO = new FullProfileDTO
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Provider = u.Provider,
                ProviderId = u.ProviderId,
                IsAdmin = u.IsAdmin,
                CreatedAt = u.CreatedTimestamp
            };
            result.Add(fullProfileDTO);
        }

        return result;
    }

    public async Task<bool> GetUserAdminStatusAsync(int id)
    {
        var user = await _context.Users.Where(u => u.Id == id).FirstOrDefaultAsync();
        if (user != null)
        {
            bool isAdmin = user.IsAdmin;

            return isAdmin;
        }
        return false;
    }

    // Skall användas när "Användare A" vill se information om "Användare B"
    // Skall inte returnera ProfileBasicsDTO då den kan innehålla information som man inte vill dela med andra, typ e-post
    public async Task<ForeignProfileDTO?> GetForeignProfileInfoAsync(int id)
    {
        var user = await _context.Users.Where(u => u.Id == id).FirstOrDefaultAsync();
        if (user != null)
        {
            List<VisitedPlaceDTO> visitedPlaces = await _placesService.GetVisitedPlacesByUserIdAsync(user.Id);
            int numberOfVisitedPlaces = visitedPlaces.Count;
            var foreignProfileDTO = new ForeignProfileDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                VisitedPlaces = numberOfVisitedPlaces,
                CreatedAt = user.CreatedTimestamp
            };

            return foreignProfileDTO;
        }
        return null;
    }

}