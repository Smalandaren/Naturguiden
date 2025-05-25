using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Interfaces;

[Authorize] // Hela denna controllern kräver autentisering
[AdminOnly] // Hela denna controllern kräver att den autentiserade användaren är admin
[ApiController]
[Route("api/admin/profiles")]
public class AdminProfilesController : ControllerBase
{
    private readonly IProfileService _profileService;

    public AdminProfilesController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet]
    public async Task<ActionResult<List<FullProfileDTO>>> GetAllProfiles()
    {
        var profiles = await _profileService.GetAllProfilesAsync();
        return Ok(profiles);
    }
}
