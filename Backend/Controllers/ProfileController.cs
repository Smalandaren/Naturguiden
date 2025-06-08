using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Interfaces;
using Backend.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Backend.Controllers
{
    [Authorize] // Hela denna controllern kräver autentisering
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;
        private readonly IPlacesService _placesService;

        public ProfileController(IProfileService profileService, IPlacesService placesService)
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

        // Anropas när "Användare A" vill se information om "Användare B"
        [HttpGet("{userId}")]
        public async Task<ActionResult<ForeignProfileDTO>> GetForeignProfileInfo(int userId)
        {
            ForeignProfileDTO? profile = await _profileService.GetForeignProfileInfoAsync(userId);
            if (profile == null)
            {
                return NotFound();
            }
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

        [HttpPut("update")]
        public async Task<ActionResult<ProfileBasicsDTO>> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (request.FirstName.Length > 25 || request.LastName.Length > 40)
            {
                return BadRequest();
            }

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdString, out int userId)) // Variabeln userId skapas bara om userIdString går att omvandla till en int
            {
                return Unauthorized("Invalid user id");
            }

            var profile = await _profileService.UpdateProfileAsync(userId, request.FirstName, request.LastName);
            return Ok(profile);
        }

        [HttpDelete("delete")]
        public async Task<ActionResult<bool>> DeleteProfile()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdString, out int userId)) // Variabeln userId skapas bara om userIdString går att omvandla till en int
            {
                return Unauthorized("Invalid user id");
            }

            var deletion = await _profileService.DeleteProfileAsync(userId);
            if (deletion == true)
            {
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                return Ok(new { Message = "Profile deleted" });
            }
            return StatusCode(500, new { Message = "Could not delete profile" });
        }

        [HttpGet("search/{query}")]
        public async Task<ActionResult<List<ForeignProfileDTO>>> Search(string query)
        {
            var profiles = await _profileService.SearchAsync(query);
            return Ok(profiles);
        }
    }
}