using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

public class AnnouncementBannerService
{
    private readonly ApplicationDbContext _context;

    public AnnouncementBannerService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AnnouncementBanner?> GetAnnouncementBannerAsync()
    {
        AnnouncementBanner? announcementBanner = await _context.AnnouncementBanners.FirstOrDefaultAsync(ab => ab.Id == 1);
        return announcementBanner;
    }

    public async Task<AnnouncementBanner?> CreateOrUpdateAnnouncementBannerAsync(AnnouncementBannerDTO dto)
    {
        AnnouncementBanner? banner = await _context.AnnouncementBanners.FirstOrDefaultAsync(ab => ab.Id == 1);
        if (banner == null)
        {
            banner = new AnnouncementBanner
            {
                Id = 1,
                Title = dto.Title,
                Subtitle = dto.Subtitle,
                Type = dto.Type,
                ShowButton = dto.ShowButton,
                ButtonText = dto.ButtonText,
                ButtonLink = dto.ButtonLink,
                IsActive = dto.IsActive
            };

            await _context.AnnouncementBanners.AddAsync(banner);
        }
        else
        {
            banner.Title = dto.Title;
            banner.Subtitle = dto.Subtitle;
            banner.Type = dto.Type;
            banner.ShowButton = dto.ShowButton;
            banner.ButtonText = dto.ButtonText;
            banner.ButtonLink = dto.ButtonLink;
            banner.IsActive = dto.IsActive;

            _context.AnnouncementBanners.Update(banner);
        }
        await _context.SaveChangesAsync();
        return banner;
    }
}