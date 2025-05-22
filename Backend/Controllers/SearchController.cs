using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;


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
    public async Task<ActionResult<List<PlaceDTO>>> Search([FromBody] String searchTerm)
    {
        var matches = await _searchService.Search(searchTerm);
        if (matches != null && matches.Count > 0)
        {
            return Ok(matches);
        }
        return Ok();
    }

    [HttpGet("utilities")]
    public ActionResult<List<AvailableUtility>> GetAllUtilities()
    {
        List<AvailableUtility> result = _searchService.GetAllUtilities(); 
        if (result != null && result.Count > 0) {return Ok(result); }
        return new EmptyResult();
    }

    [HttpGet("categories")]
    public ActionResult<List<AvailableCategory>> GetAllCategories()
    {
        List<AvailableCategory> result = _searchService.GetAllCategories();
        if (result != null && result.Count > 0) { return Ok(result); }
        return new EmptyResult();
    }
}
