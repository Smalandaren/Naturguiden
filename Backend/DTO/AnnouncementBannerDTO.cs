using System.ComponentModel.DataAnnotations;

public class AnnouncementBannerDTO
{
    [Required]
    [MaxLength(60, ErrorMessage = "Title can not be longer than 60 characters")]
    public required string Title { get; set; }

    [MaxLength(60, ErrorMessage = "Subtitle can not be longer than 60 characters")]
    public string? Subtitle { get; set; }

    [Required]
    public required string Type { get; set; }

    public bool ShowButton { get; set; }

    [MaxLength(15, ErrorMessage = "Button text can not be longer than 15 characters")]
    public string? ButtonText { get; set; }

    public string? ButtonLink { get; set; }

    public bool IsActive { get; set; }
}
