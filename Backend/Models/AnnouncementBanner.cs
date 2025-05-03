using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class AnnouncementBanner
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string? Subtitle { get; set; }

    /// <summary>
    /// &apos;information&apos; or &apos;danger&apos;
    /// </summary>
    public string Type { get; set; } = null!;

    public bool ShowButton { get; set; }

    public string? ButtonText { get; set; }

    public string? ButtonLink { get; set; }

    public bool IsActive { get; set; }
}
