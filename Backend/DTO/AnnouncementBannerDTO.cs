using System.ComponentModel.DataAnnotations;

public class AnnouncementBannerDTO
{
    [Required]
    public required string Title { get; set; }

    public string? Subtitle { get; set; }

    [Required]
    public required string Type { get; set; }

    public bool ShowButton { get; set; }

    public string? ButtonText { get; set; }

    public string? ButtonLink { get; set; }

    public bool IsActive { get; set; }
}
