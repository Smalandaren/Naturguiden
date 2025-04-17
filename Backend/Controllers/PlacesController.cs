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
        public async Task<ActionResult<List<PlaceDTO>>> GetAllNatureSpots()
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
    }
}