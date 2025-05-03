using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize] // Hela denna controllern kräver autentisering
[AdminOnly] // Hela denna controllern kräver att den autentiserade användaren är admin
[ApiController]
[Route("api/admin/announcement")]
public class AdminAnnouncementBannerController : ControllerBase
{
    private readonly AnnouncementBannerService _announcementBannerService;

    public AdminAnnouncementBannerController(AnnouncementBannerService announcementBannerService)
    {
        _announcementBannerService = announcementBannerService;
    }

    [HttpGet]
    public async Task<ActionResult<AnnouncementBanner?>> GetAnnouncementBanner()
    {
        AnnouncementBanner? banner = await _announcementBannerService.GetAnnouncementBannerAsync();
        return Ok(banner);
    }

    [HttpPost]
    public async Task<ActionResult<AnnouncementBanner?>> CreateOrUpdateAnnouncementBanner([FromBody] AnnouncementBannerDTO dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Här definerar vi vilka sorters banners som vi tillåter. Just nu bara "information" (grön) och "danger" (röd)
        var allowedTypes = new[] { "information", "danger" };
        if (!allowedTypes.Contains(dto.Type.ToLower()))
        {
            return BadRequest(new { message = "Banner type must be either 'information' or 'danger'" });
        }
        AnnouncementBanner? banner = await _announcementBannerService.CreateOrUpdateAnnouncementBannerAsync(dto);
        return Ok(banner);
    }
}