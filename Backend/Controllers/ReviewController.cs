using Backend.DTO;
using Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService _reviewService;

        public ReviewController(ReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        public async Task<ActionResult<List<ReviewDTO>>> Get([FromBody] ReviewDTO place)
        {
            return Ok( await _reviewService.GetReviews(place.PlaceId));
        }
    }
}
