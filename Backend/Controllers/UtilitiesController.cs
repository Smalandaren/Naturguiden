using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UtilitiesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UtilitiesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAll()
    {
        var utilities = await _context.AvailableUtilities
            .Select(u => new { u.Name })
            .ToListAsync();

        return Ok(utilities);
    }
}
