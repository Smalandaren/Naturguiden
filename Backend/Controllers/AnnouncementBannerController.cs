using Backend.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/announcement")]
public class AnnouncementBannerController : ControllerBase
{
    private readonly AnnouncementBannerService _announcementBannerService;

    public AnnouncementBannerController(AnnouncementBannerService announcementBannerService)
    {
        _announcementBannerService = announcementBannerService;
    }

    [HttpGet]
    public async Task<ActionResult<AnnouncementBanner?>> GetAnnouncementBanner()
    {
        AnnouncementBanner? banner = await _announcementBannerService.GetActiveAnnouncementBannerAsync();
        return Ok(banner);
    }
}