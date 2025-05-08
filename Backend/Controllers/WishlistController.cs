using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using System.Security.Claims;

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

        /*
        [HttpGet]
        public async Task<ActionResult<List<PlaceDTO>>> GetAllNatureSpots()
        {
            int currentUserID = Int32.Parse(this.User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var places = await _wishlistService.GetWishlist(currentUserID);
            return Ok(places);
        }
        */
    }
}
