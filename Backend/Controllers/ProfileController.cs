using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Authorize] // Hela denna controllern kräver autentisering
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly ProfileService _profileService;
        private readonly PlacesService _placesService;

        public ProfileController(ProfileService profileService, PlacesService placesService)
        {
            _profileService = profileService;
            _placesService = placesService;
        }

        [HttpGet]
        public async Task<ActionResult<ProfileBasicsDTO>> GetBasicProfileInfo()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdString, out int userId)) // Variabeln userId skapas bara om userIdString går att omvandla till en int
            {
                return Unauthorized("Invalid user id");
            }

            var profile = await _profileService.GetBasicProfileInfoAsync(userId);
            return Ok(profile);
        }

        [HttpGet("visited-places")]
        public async Task<ActionResult<List<VisitedPlaceDTO>>> GetVisitedPlaces()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdString, out int userId)) // Variabeln userId skapas bara om userIdString går att omvandla till en int
            {
                return Unauthorized("Invalid user id");
            }

            var visitedPlaces = await _placesService.GetVisitedPlacesByUserIdAsync(userId);
            return Ok(visitedPlaces);
        }
    }
}