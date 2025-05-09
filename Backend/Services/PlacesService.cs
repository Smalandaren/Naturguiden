using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;
using Backend.DTO;

public class PlacesService
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
            .Where(p => p.Approved)
            .Include(p => p.PlaceCategories)
                .ThenInclude(pc => pc.CategoryNameNavigation)
            .Include(p => p.PlaceUtilities)
                .ThenInclude(pu => pu.UtilityNameNavigation)
                .Include(p => p.Images)
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
                Address = p.Address,
                Approved = p.Approved,
                CreatedBy = p.CreatedBy,
                CreatedAt = p.CreatedTimestamp,

                Categories = p.PlaceCategories.Select(pc => new CategoryDTO
                {
                    Name = pc.CategoryName,
                    Description = pc.Description ?? pc.CategoryNameNavigation.Description
                }).ToList(),

                Attributes = p.PlaceUtilities.Select(pu => new AttributeDTO
                {
                    Name = pu.UtilityName,
                    Description = pu.Description ?? pu.UtilityNameNavigation.Description
                }).ToList(),

                PlaceUtilities = p.PlaceUtilities.Select(pu => new PlaceUtilityDTO
                {
                    Name = pu.UtilityName,
                    Description = pu.Description ?? pu.UtilityNameNavigation.Description
                }).ToList(),
                ImageUrls = p.Images.Select(img => img.Url).ToList()

            };
            result.Add(placeDTO);
        }

        return result;
    }
    public async Task<PlaceDTO?> GetAsync(int id)
    {
        var place = await _context.Places
            .Where(p => p.Id == id)
            .Include(p => p.PlaceCategories)
                .ThenInclude(pc => pc.CategoryNameNavigation)
            .Include(p => p.PlaceUtilities)
                .ThenInclude(pu => pu.UtilityNameNavigation)
                .Include(p => p.Images)

            .FirstOrDefaultAsync();

        if (place == null) return null;

        return new PlaceDTO
        {
            Id = place.Id,
            Name = place.Name,
            Description = place.Description,
            Latitude = place.Latitude,
            Longitude = place.Longitude,
            Address = place.Address,
            Approved = place.Approved,
            CreatedBy = place.CreatedBy,
            CreatedAt = place.CreatedTimestamp,

            Categories = place.PlaceCategories.Select(pc => new CategoryDTO
            {
                Name = pc.CategoryName,
                Description = pc.Description ?? pc.CategoryNameNavigation.Description
            }).ToList(),

            Attributes = place.PlaceUtilities.Select(pu => new AttributeDTO
            {
                Name = pu.UtilityName,
                Description = pu.Description ?? pu.UtilityNameNavigation.Description
            }).ToList(),

            PlaceUtilities = place.PlaceUtilities.Select(pu => new PlaceUtilityDTO
            {
                Name = pu.UtilityName,
                Description = pu.Description ?? pu.UtilityNameNavigation.Description
            }).ToList(),
            ImageUrls = place.Images.Select(img => img.Url).ToList()


        };
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

    public async Task<List<CategoryDTO>> GetPlaceCategoriesAsync(int placeId)
    {
        return await _context.PlaceCategories
            .Where(c => c.PlaceId == placeId)
            .Select(c => new CategoryDTO
            {
                Name = c.CategoryName,
                Description = c.Description
            })
            .ToListAsync();
    }

    public async Task<List<AttributeDTO>> GetPlaceAttributesAsync(int placeId)
    {
        return await _context.PlaceUtilities
            .Where(a => a.PlaceId == placeId)
            .Select(a => new AttributeDTO
            {
                Name = a.UtilityName,
                Description = a.Description
            })
            .ToListAsync();
    }

}