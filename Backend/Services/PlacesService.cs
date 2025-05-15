using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Interfaces;

public class PlacesService : IPlacesService
{
    private readonly ApplicationDbContext _context;

    public PlacesService(ApplicationDbContext context)
    {
        _context = context;
    }

    // Hämtar alla platser
    public async Task<List<PlaceDTO>> GetAllAsync()
    {
        var places = await _context.Places
            .Include(p => p.PlaceUtilities)
            .ToListAsync();

        var result = new List<PlaceDTO>();

        foreach (var p in places)
        {
            var placeDTO = new PlaceDTO
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Latitude = p.Latitude,
                Longitude = p.Longitude,
                CreatedAt = p.CreatedTimestamp,
                PlaceUtilities = await GetPlaceUtilitiesAsync(p.Id)
            };
            result.Add(placeDTO);
        }

        return result;
    }

    // Hämtar en specifik plats
    public async Task<PlaceDTO?> GetAsync(int id)
    {
        var place = await _context.Places.Where(p => p.Id == id).FirstOrDefaultAsync();
        if (place != null)
        {
            var placeDTO = new PlaceDTO
            {
                Id = place.Id,
                Name = place.Name,
                Description = place.Description,
                Latitude = place.Latitude,
                Longitude = place.Longitude,
                CreatedAt = place.CreatedTimestamp,
                PlaceUtilities = await GetPlaceUtilitiesAsync(place.Id)
            };

            return placeDTO;
        }
        return null;
    }

    // Hämtar alla Utilities för en viss plats
    public async Task<List<PlaceUtilityDTO>> GetPlaceUtilitiesAsync(int placeId)
    {
        var placeUtilities = await _context.PlaceUtilities.Where(u => u.PlaceId == placeId).Select(u => new PlaceUtilityDTO
        {
            Name = u.UtilityName,
            Description = u.Description
        }).ToListAsync();

        foreach (var placeUtility in placeUtilities)
        {
            if (placeUtility.Description == null)
            {
                var generalDescription = await GetGeneralPlaceUtilityDescriptionAsync(placeUtility.Name);
                placeUtility.Description = generalDescription;
            }
        }

        return placeUtilities;
    }

    // Hämtar default beskrivningen för en viss Utility
    // Används om en viss PlaceUtility inte har något egen/unik beskrivning
    public async Task<string?> GetGeneralPlaceUtilityDescriptionAsync(string utilityName)
    {
        var description = await _context.AvailableUtilities
                            .Where(u => u.Name == utilityName)
                            .Select(u => u.Description)
                            .FirstOrDefaultAsync();
        return description;
    }

    // Hämtar alla platser som en viss användare har besökt
    public async Task<List<VisitedPlaceDTO>> GetVisitedPlacesByUserIdAsync(int userId)
    {
        var visitedPlaces = await _context.PlaceVisits
                                .Where(pv => pv.UserId == userId)
                                .Include(pv => pv.Place)
                                .ToListAsync();

        var result = new List<VisitedPlaceDTO>();

        foreach (var pv in visitedPlaces)
        {
            var visitedPlaceDTO = new VisitedPlaceDTO
            {
                Id = pv.Place.Id,
                Name = pv.Place.Name,
                Description = pv.Place.Description,
                Latitude = pv.Place.Latitude,
                Longitude = pv.Place.Longitude,
                CreatedAt = pv.Place.CreatedTimestamp,
                VisitedAt = pv.CreatedTimestamp,
                PlaceUtilities = await GetPlaceUtilitiesAsync(pv.Place.Id)
            };
            result.Add(visitedPlaceDTO);
        }

        return result;
    }

}