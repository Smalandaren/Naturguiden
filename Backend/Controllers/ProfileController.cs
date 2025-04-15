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
        public async Task<IActionResult> GetBasicProfileInfo()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int userId = Int32.Parse(userIdString);
            var profile = await _profileService.GetBasicProfileInfoAsync(userId);
            return Ok(profile);
        }
    }
}