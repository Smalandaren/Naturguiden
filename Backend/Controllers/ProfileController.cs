using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly ProfileService _profileService;

        public ProfileController(ProfileService profileService)
        {
            _profileService = profileService;
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
    }
}