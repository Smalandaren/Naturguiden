using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;
using System.Security.Claims;
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
    public async Task<ActionResult<bool>> HasVisited([FromBody] VisitRequest request)
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
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdString, out int currentUserID))
            {
                return Unauthorized("Invalid user id");
            }

            await _visitsService.RegisterVisit(new PlaceVisit { PlaceId = request.PlaceId, UserId = currentUserID });
            return Ok();
        }
        catch (Exception)
        {
            return BadRequest();
        }
    }

    [Authorize]
    [HttpDelete]
    public async Task<IActionResult> RemoveVisit([FromBody] VisitRequest request)
    {
        try
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdString, out int currentUserID))
            {
                return Unauthorized("Invalid user id");
            }

            if (await _visitsService.RemoveVisit(new PlaceVisit { PlaceId = request.PlaceId, UserId = currentUserID }))
            {
                return Ok();
            }
            return BadRequest();
        }
        catch (Exception)
        {
            return BadRequest();
        }
    }
}

