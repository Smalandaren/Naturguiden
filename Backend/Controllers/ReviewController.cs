using Backend.DTO;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

        [HttpPost("getall")]
        public async Task<ActionResult<List<ReviewDTO>>> Get([FromBody] ReviewDTO place)
        {
            return Ok( await _reviewService.GetReviews(place.PlaceId));
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<ActionResult> Create([FromBody] ReviewDTO reviewDTO)
        {
            if (reviewDTO.Rating !>= 1 || reviewDTO.Rating !<= 5)
            {
                return BadRequest();
            }

            ClaimsPrincipal currentUser = this.User;
            int currentUserID = Int32.Parse(currentUser.FindFirst(ClaimTypes.NameIdentifier).Value);

            Review review = new Review()
            {
                PlaceId = reviewDTO.PlaceId,
                UserId = currentUserID,
                Rating = reviewDTO.Rating,
                Comment = reviewDTO.Comment,
            };
            if (await _reviewService.Create(review))
            {
                return Ok();
            }
            return BadRequest();
        }
    }
}
