using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AttributesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AttributesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAttributes()
    {
        var attributes = await _context.AvailableUtilities.ToListAsync();
        return Ok(attributes.Select(a => new { name = a.Name }));
    }
}
