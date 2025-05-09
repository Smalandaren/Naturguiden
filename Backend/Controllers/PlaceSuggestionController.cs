using Backend.Data;
using Backend.DTO;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class PlaceSuggestionController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PlaceSuggestionController(ApplicationDbContext context)
    {
        _context = context;
    }
    [HttpPost]
    public async Task<IActionResult> CreatePlaceSuggestion([FromBody] PlaceSuggestionDTO dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _context.Users.FirstOrDefaultAsync(u => u.FirstName == dto.UserName);
        if (user == null)
            return NotFound("User not found");

        // Skapa kategorier om de inte redan finns
        if (dto.CategoryNames != null)
        {
            foreach (var name in dto.CategoryNames)
            {
                if (await _context.AvailableCategories.FindAsync(name) == null)
                    _context.AvailableCategories.Add(new AvailableCategory { Name = name, Description = "" });
            }
        }

        // Skapa attribut om de inte redan finns
        if (dto.AttributeNames != null)
        {
            foreach (var name in dto.AttributeNames)
            {
                if (await _context.AvailableUtilities.FindAsync(name) == null)
                    _context.AvailableUtilities.Add(new AvailableUtility { Name = name, Description = "" });
            }
        }

        await _context.SaveChangesAsync();

        // Skapa platsförslag
        var suggestion = new PlaceSuggestion
        {
            Name = dto.Name,
            Description = dto.Description,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            Address = dto.Address,
            UserId = user.Id,
            IsConfirmed = false,
            Categories = dto.CategoryNames != null
                ? await _context.AvailableCategories
                    .Where(c => dto.CategoryNames.Contains(c.Name))
                    .ToListAsync()
                : new List<AvailableCategory>(),
            Attributes = dto.AttributeNames != null
                ? await _context.AvailableUtilities
                    .Where(a => dto.AttributeNames.Contains(a.Name))
                    .ToListAsync()
                : new List<AvailableUtility>(),
            Images = dto.ImageUrls != null
                ? dto.ImageUrls.Select(url => new Image { Url = url }).ToList()
                : new List<Image>()
        };

        _context.PlaceSuggestions.Add(suggestion);
        await _context.SaveChangesAsync();

        return Ok(suggestion);
    }




    [HttpGet]
    public async Task<IActionResult> GetAllSuggestions()
    {
        var suggestions = await _context.PlaceSuggestions
            .Include(p => p.Categories)
            .Include(p => p.Attributes)
            .Include(p => p.Images)
            .Include(p => p.User)
            .ToListAsync();

        var publishedPlaces = await _context.Places.ToListAsync();

        var result = suggestions.Select(s => new PlaceSuggestionSummaryDTO
        {
            Id = s.Id,
            Name = s.Name,
            Description = s.Description,
            Latitude = s.Latitude,
            Longitude = s.Longitude,
            Address = s.Address,
            UserId = s.UserId,
            IsConfirmed = s.IsConfirmed,
            IsPublished = publishedPlaces.Any(p =>
                p.Name == s.Name &&
                Math.Abs((double)p.Latitude - s.Latitude) < 0.0001 &&
                Math.Abs((double)p.Longitude - s.Longitude) < 0.0001
            )
        }).ToList();

        return Ok(result);
    }




    [HttpPut("{id}/confirm")]
    public async Task<IActionResult> ConfirmSuggestion(int id)
    {
        var suggestion = await _context.PlaceSuggestions.FindAsync(id);
        if (suggestion == null)
            return NotFound();

        suggestion.IsConfirmed = true;
        await _context.SaveChangesAsync();

        return Ok(suggestion);
    }

    [HttpPost("{id}/publish")]
    public async Task<IActionResult> PublishSuggestion(int id)
    {
        try
        {
            var suggestion = await _context.PlaceSuggestions
                .Include(p => p.Categories)
                .Include(p => p.Attributes)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (suggestion == null || !suggestion.IsConfirmed)
                return BadRequest("Förslaget finns inte eller är inte bekräftat.");

            var newPlace = new Place
            {
                Name = suggestion.Name,
                Description = suggestion.Description,
                Latitude = (decimal)suggestion.Latitude,
                Longitude = (decimal)suggestion.Longitude,
                Address = suggestion.Address,
                Approved = true,
                CreatedBy = suggestion.UserId,
                CreatedTimestamp = DateTime.Now,
                Images = suggestion.Images?.Select(img => new Image { Url = img.Url }).ToList() ?? new()
            };

            _context.Places.Add(newPlace);
            await _context.SaveChangesAsync(); // Viktigt! Vi behöver Place.Id innan vi kan koppla kategorier/attribut

            // Lägg till kopplingar till kategorier
            if (suggestion.Categories != null)
            {
                foreach (var cat in suggestion.Categories)
                {
                    _context.PlaceCategories.Add(new PlaceCategory
                    {
                        PlaceId = newPlace.Id,
                        CategoryName = cat.Name,
                        Description = cat.Description
                    });
                }
            }

            // Lägg till kopplingar till attribut
            if (suggestion.Attributes != null)
            {
                foreach (var attr in suggestion.Attributes)
                {
                    _context.PlaceUtilities.Add(new PlaceUtility
                    {
                        PlaceId = newPlace.Id,
                        UtilityName = attr.Name,
                        Description = attr.Description
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(newPlace);
        }
        catch (Exception ex)
        {
            Console.WriteLine("❌ FEL I PUBLISH: " + ex.Message);
            return StatusCode(500, "Ett internt fel uppstod vid publicering.");
        }
    }



    [HttpGet("unconfirmed")]
    public async Task<IActionResult> GetUnconfirmedSuggestions()
    {
        var suggestions = await _context.PlaceSuggestions
            .Where(p => !p.IsConfirmed)
            .Include(p => p.User)
            .ToListAsync();

        return Ok(suggestions);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RejectSuggestion(int id)
    {
        var suggestion = await _context.PlaceSuggestions
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (suggestion == null)
            return NotFound();

        // Ta bort bilder först (pga foreign key constraint)
        _context.Images.RemoveRange(suggestion.Images);

        _context.PlaceSuggestions.Remove(suggestion);
        await _context.SaveChangesAsync();

        return NoContent();
    }


}
