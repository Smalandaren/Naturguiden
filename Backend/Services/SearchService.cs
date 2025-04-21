using Backend.Data;
using System.Collections;
using Backend.Models;

public class SearchService
{
    private readonly ApplicationDbContext _context;
    private readonly PlacesService _placesService;

    public SearchService(ApplicationDbContext context)
    {
        _context = context;
        _placesService = new PlacesService(context);
    }

    public async Task<List<PlaceDTO>> Search(String searchTerm)
    {
        List<Place> matches = new List<Place>();
        List<PlaceDTO> matchesDTO = new List<PlaceDTO>();

        matches = _context.Places.Where(p => p.Name.Contains(searchTerm)).ToList();

        if (matches.Count > 0)
        {
            for (int i = 0; i < matches.Count; i++)
            {
                matchesDTO.Add(await _placesService.GetAsync(matches[i].Id));
            }
        }
        return matchesDTO;
    }
}

