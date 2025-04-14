using Backend.Models;
using Microsoft.AspNetCore.Authorization;
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
    public async Task<IActionResult> HasVisited([FromBody] VisitRequest request)
    {
        try
        {
            if (await _visitsService.HasVisited(request.PlaceId, request.UserId))
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

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> RegisterVisit([FromBody] VisitRequest request)
    {
        try
        {
            await _visitsService.RegisterVisit(request);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpDelete]
    public async Task<IActionResult> RemoveVisit([FromBody] VisitRequest request)
    {
        try
        {
            await _visitsService.RemoveVisit(request);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

