using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/admin/placesuggestions")]
    public class PlaceSuggestionAdminController : ControllerBase
    {
        private readonly PlaceSuggestionService _service;

        public PlaceSuggestionAdminController(PlaceSuggestionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<PlaceSuggestion>>> GetAllSuggestions()
        {
            var suggestions = await _service.GetAllSuggestionsAsync();
            return Ok(suggestions);
        }

        [HttpPut("{id}/confirm")]
        public async Task<ActionResult> ConfirmSuggestion(int id)
        {
            var result = await _service.ConfirmSuggestionAsync(id);
            if (result == null)
                return NotFound("Förslaget hittades inte.");

            return Ok("Förslaget är nu bekräftat.");
        }

        [HttpPost("{id}/publish")]
        public async Task<ActionResult<Place>> PublishSuggestion(int id)
        {
            var result = await _service.PublishSuggestionAsync(id);
            if (result == null)
                return BadRequest("Förslaget är ogiltigt eller inte bekräftat.");

            return Ok(result);
        }
    }
}
