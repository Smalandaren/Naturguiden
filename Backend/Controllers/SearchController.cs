using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;
using Backend.DTO;


[Route("api/[controller]")]
[ApiController]
public class SearchController : ControllerBase
{
    private readonly SearchService _searchService;

    public SearchController(SearchService searchService)
    {
        _searchService = searchService;
    }

    [HttpPost]
    public async Task<ActionResult<List<PlaceDTO>>> Search([FromBody] SearchTerm searchTerm)
    {
        Console.WriteLine(searchTerm.SearchWord);
        Console.WriteLine("Wtf bro");
        if (searchTerm.SearchWord == null || searchTerm.SearchWord.Length == 0) //Kan utvecklas om man lägger till kategorier/attribut i SearchTerm
        {
            return BadRequest();
        }
        var matches = await _searchService.Search(searchTerm.SearchWord);
        if (matches != null && matches.Count > 0)
        {
            return Ok(matches);
        }
        return Ok();
    }

}
