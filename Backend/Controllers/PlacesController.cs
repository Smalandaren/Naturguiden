using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Backend.DTO;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlacesController : ControllerBase
    {
        private readonly IPlacesService _placesService;

        public PlacesController(IPlacesService placesService)
        {
            _placesService = placesService;
        }

        [HttpGet]
        public async Task<ActionResult<List<PlaceDTO>>> GetAll()
        {
            var places = await _placesService.GetAllAsync();
            return Ok(places);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PlaceDTO>> Get(int id)
        {
            var place = await _placesService.GetAsync(id);
            if (place != null)
            {
                return Ok(place);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<int>> Create([FromBody] CreatePlaceDTO dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            try
            {
                var placeId = await _placesService.CreateAsync(dto, userId);
                return Ok(placeId);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpGet("pending")]
        [Authorize]
        public async Task<ActionResult<List<PlaceDTO>>> GetPending()
        {
            var places = await _placesService.GetPendingAsync();
            return Ok(places);
        }

        [HttpPatch("{id}/approve")]
        [Authorize]
        public async Task<IActionResult> ApprovePlace(int id)
        {
            var success = await _placesService.ApproveAsync(id);
            if (!success) return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _placesService.DeleteAsync(id);
            if (!success) return NotFound();

            return NoContent();
        }

        [HttpPost("{id}/upload-image")]
        [Authorize]
        public async Task<IActionResult> UploadImage(int id, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Ingen fil vald");

            var result = await _placesService.UploadImageAsync(id, file);

            if (!result.success)
                return BadRequest(result.message);

            return Ok(new { filename = result.filename });
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePlaceDTO dto)
        {
            var success = await _placesService.UpdateAsync(id, dto);

            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}