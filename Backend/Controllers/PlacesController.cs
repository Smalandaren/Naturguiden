using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlacesController : ControllerBase
    {
        private readonly PlacesService _placesService;

        public PlacesController(PlacesService placesService)
        {
            _placesService = placesService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNatureSpots()
        {
            var places = await _placesService.GetAllAsync();
            return Ok(places);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
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
    }
}