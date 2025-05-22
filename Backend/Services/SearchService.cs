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
        List<Place> nameMatches = new List<Place>();
        List<Place> descMatches = new List<Place>();

        List<PlaceDTO> matchesDTO = new List<PlaceDTO>();

        nameMatches = _context.Places.Where(p => p.Name.ToLower().Contains(searchTerm.ToLower())).ToList();
        descMatches = _context.Places.Where(p => p.Description.ToLower().Contains(searchTerm.ToLower()) && !nameMatches.Contains(p)).ToList();


        if (nameMatches.Count > 0)
        {
            for (int i = 0; i < nameMatches.Count; i++)
            {
                PlaceDTO? place = await _placesService.GetAsync(nameMatches[i].Id);
                if(place != null)
                {
                    matchesDTO.Add(place);
                }
            }
        }
        if (descMatches.Count > 0)
        {
            for(int i = 0; i < descMatches.Count; i++)
            {
                PlaceDTO? place = await _placesService.GetAsync(descMatches[i].Id);
                if (place != null)
                {
                    matchesDTO.Add(place);
                }
            }
        }
        return matchesDTO;
    }
}

