using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Interfaces;
using Backend.DTO;
using Backend.Models;

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
            .Where(p => p.Approved)
            .Include(p => p.PlaceUtilities)
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
                CreatedAt = p.CreatedTimestamp,
                PlaceUtilities = await GetPlaceUtilitiesAsync(p.Id),
                PlaceCategories = await GetPlaceCategoriesAsync(p.Id),
                Images = p.Images.Select(img => img.Filename).ToList()
            };
            result.Add(placeDTO);
        }

        return result;
    }

    // Hämtar en specifik plats
    public async Task<PlaceDTO?> GetAsync(int id)
    {
        var place = await _context.Places
            .Include(p => p.Images)
            .Where(p => p.Id == id)
            .FirstOrDefaultAsync(p => p.Id == id);

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
                PlaceUtilities = await GetPlaceUtilitiesAsync(place.Id),
                PlaceCategories = await GetPlaceCategoriesAsync(place.Id),
                Images = place.Images.Select(img => img.Filename).ToList()
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

    public async Task<List<PlaceCategoryDTO>> GetPlaceCategoriesAsync(int placeId)
    {
        var placeCategories = await _context.PlaceCategories.Where(u => u.PlaceId == placeId).Select(u => new PlaceCategoryDTO
        {
            Name = u.CategoryName,
            Description = u.Description
        }).ToListAsync();

        foreach (var placeCategory in placeCategories)
        {
            if (placeCategory.Description == null)
            {
                var generalDescription = await GetGeneralPlaceCategoryDescriptionAsync(placeCategory.Name);
                placeCategory.Description = generalDescription;
            }
        }

        return placeCategories;
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

    public async Task<string?> GetGeneralPlaceCategoryDescriptionAsync(string categoryName)
    {
        var description = await _context.AvailableCategories
                            .Where(u => u.Name == categoryName)
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
    public async Task<int> CreateAsync(CreatePlaceDTO dto, int userId)
    {
        var nextId = await _context.Places.MaxAsync(p => (int?)p.Id) ?? 0;
        nextId += 1;

        var place = new Place
        {
            Id = nextId, 
            Name = dto.Name,
            Description = dto.Description,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            Address = dto.Address,
            Approved = false,
            CreatedBy = userId,
            CreatedTimestamp = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified) 
        };

        _context.Places.Add(place);
        foreach (var category in dto.CategoryNames ?? new())
        {
            _context.PlaceCategories.Add(new PlaceCategory
            {
                PlaceId = place.Id,
                CategoryName = category
            });
        }

        foreach (var utility in dto.UtilityNames  ?? new())
        {
            _context.PlaceUtilities.Add(new PlaceUtility
            {
                PlaceId = place.Id,
                UtilityName = utility
            });
        }

        await _context.SaveChangesAsync();
        return place.Id;
    }

    public async Task<List<PlaceDTO>> GetPendingAsync()
    {
        var places = await _context.Places
            .Where(p => !p.Approved)
            .Include(p => p.PlaceUtilities)
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
                CreatedAt = p.CreatedTimestamp,
                PlaceUtilities = await GetPlaceUtilitiesAsync(p.Id),
                PlaceCategories = await GetPlaceCategoriesAsync(p.Id),
                Images = p.Images.Select(img => img.Filename).ToList()
            };

            result.Add(placeDTO);
        }

        return result;
    }

    public async Task<bool> ApproveAsync(int placeId)
    {
        var place = await _context.Places.FindAsync(placeId);
        if (place == null || place.Approved)
            return false;

        place.Approved = true;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var place = await _context.Places
            .Include(p => p.PlaceCategories)
            .Include(p => p.PlaceUtilities)
            .Include(p => p.Images) 
            .FirstOrDefaultAsync(p => p.Id == id && !p.Approved);

        if (place == null) return false;

        foreach (var image in place.Images)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", image.Filename);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }

        _context.Images.RemoveRange(place.Images);
        _context.PlaceCategories.RemoveRange(place.PlaceCategories);
        _context.PlaceUtilities.RemoveRange(place.PlaceUtilities);
        _context.Places.Remove(place);

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<(bool success, string message, string? filename)> UploadImageAsync(int placeId, IFormFile file)
    {
        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);

        var fileName = $"{Guid.NewGuid()}_{file.FileName}";
        var filePath = Path.Combine(uploadsPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        _context.Images.Add(new Image
        {
            PlaceId = placeId,
            Filename = fileName
        });

        await _context.SaveChangesAsync();

        return (true, "Uppladdad", fileName);
    }
}