using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

public class PlaceSuggestionService
{
    private readonly ApplicationDbContext _context;

    public PlaceSuggestionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PlaceSuggestion>> GetAllSuggestionsAsync()
    {
        return await _context.PlaceSuggestions
            .Include(p => p.User)
            .Include(p => p.Categories)
            .Include(p => p.Attributes)
            .Include(p => p.Images)
            .ToListAsync();
    }

    public async Task<PlaceSuggestion?> ConfirmSuggestionAsync(int id)
    {
        var suggestion = await _context.PlaceSuggestions.FindAsync(id);
        if (suggestion == null) return null;

        suggestion.IsConfirmed = true;
        await _context.SaveChangesAsync();
        return suggestion;
    }

    public async Task<Place?> PublishSuggestionAsync(int id)
    {
        var suggestion = await _context.PlaceSuggestions
            .Include(p => p.Categories)
            .Include(p => p.Attributes)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (suggestion == null || !suggestion.IsConfirmed)
            return null;

        var newPlace = new Place
        {
            Name = suggestion.Name,
            Description = suggestion.Description,
            Latitude = (decimal)suggestion.Latitude,
            Longitude = (decimal)suggestion.Longitude,
            Address = suggestion.Address,
            Approved = true,
            CreatedBy = suggestion.UserId,
            CreatedTimestamp = DateTime.UtcNow,
            Images = suggestion.Images?.Select(img => new Image { Url = img.Url }).ToList() ?? new List<Image>()
        };

        _context.Places.Add(newPlace);
        await _context.SaveChangesAsync(); // Viktigt för att få ID

        // Lägg till PlaceCategories
        if (suggestion.Categories != null)
        {
            foreach (var category in suggestion.Categories)
            {
                _context.PlaceCategories.Add(new PlaceCategory
                {
                    PlaceId = newPlace.Id,
                    CategoryName = category.Name,
                    Description = category.Description
                });
            }
        }

        // Lägg till PlaceUtilities
        if (suggestion.Attributes != null)
        {
            foreach (var attribute in suggestion.Attributes)
            {
                _context.PlaceUtilities.Add(new PlaceUtility
                {
                    PlaceId = newPlace.Id,
                    UtilityName = attribute.Name,
                    Description = attribute.Description
                });
            }
        }

        await _context.SaveChangesAsync();

        // Hämta platsen igen, inklusive relationer
        var fullPlace = await _context.Places
            .Where(p => p.Id == newPlace.Id)
            .Include(p => p.PlaceCategories)
            .Include(p => p.PlaceUtilities)
            .Include(p => p.Images)
            .FirstOrDefaultAsync();

        if (fullPlace != null)
        {
            fullPlace.Categories = fullPlace.PlaceCategories.Select(pc => new AvailableCategory
            {
                Name = pc.CategoryName,
                Description = pc.Description
            }).ToList();

            fullPlace.Attributes = fullPlace.PlaceUtilities.Select(pu => new AvailableUtility
            {
                Name = pu.UtilityName,
                Description = pu.Description
            }).ToList();
        }

        return fullPlace;
    }

    public async Task<List<AvailableCategory>> EnsureCategoriesExistAsync(List<string> categoryNames)
    {
        var result = new List<AvailableCategory>();

        foreach (var name in categoryNames)
        {
            var existing = await _context.AvailableCategories.FindAsync(name);
            if (existing == null)
            {
                existing = new AvailableCategory
                {
                    Name = name,
                    Description = "" // Tom beskrivning som admin kan fylla i senare
                };
                _context.AvailableCategories.Add(existing);
                // OBS! Vi lägger inte till SaveChanges här – det gör vi i slutet
            }

            result.Add(existing);
        }

        await _context.SaveChangesAsync(); // Spara eventuellt nya kategorier
        return result;
    }






}
