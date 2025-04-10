using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;
using System.Text.Json;


[Route("api/[controller]")]
[ApiController]
public class VisitsController : ControllerBase
{
    private readonly VisitsService _visitsService;

    public VisitsController(VisitsService visitService)
    {
        _visitsService = visitService;
    }

    [HttpPost("check-visit")]
    public async Task<IActionResult> HasVisited([FromBody] JsonElement data)
    {
        try
        {
            PlaceVisit visit = JsonSerializer.Deserialize<PlaceVisit>(data);

            if (await _visitsService.HasVisited(visit.PlaceId, visit.UserId))
            {
                return Ok(true);
            }
            return Ok(false);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> RegisterVisit([FromBody] JsonElement data)
    {
        try
        {
            PlaceVisit visit = JsonSerializer.Deserialize<PlaceVisit>(data);
            await _visitsService.RegisterVisit(visit);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete]
    public async Task<IActionResult> RemoveVisit([FromBody] JsonElement data)
    {
        try
        {
            PlaceVisit visit = JsonSerializer.Deserialize<PlaceVisit>(data);
            await _visitsService.RemoveVisit(visit);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

