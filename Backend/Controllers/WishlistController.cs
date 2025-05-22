using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using System.Security.Claims;
using Backend.DTO;
using System.CodeDom;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly WishlistService _wishlistService;

        public WishlistController(WishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        [HttpGet]
        public async Task<ActionResult<List<PlaceDTO>>> GetWishlist()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdString, out int currentUserID))
            {
                return Unauthorized("Invalid user id");
            }

            var places = await _wishlistService.GetWishlist(currentUserID);
            return Ok(places);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddToWishlist([FromBody] WishlistDTO wishlistDTO)
        {
            await _wishlistService.AddToWishlist(wishlistDTO.UserId, wishlistDTO.PlaceId);
            return Ok();
        }

        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveFromWishlist([FromBody] WishlistDTO wishlistDTO)
        {
            await _wishlistService.RemoveFromWishlist(wishlistDTO.UserId, wishlistDTO.PlaceId);
            return Ok();
        }

        [HttpPost("check")]
        public async Task<ActionResult<bool>> CheckWishlist([FromBody] WishlistDTO wishlistDTO) 
        {
            if (await _wishlistService.CheckWishlist(wishlistDTO.UserId, wishlistDTO.PlaceId))
            {
                return Ok(true); 
            } 
            return Ok(false);
        }
    }
}
