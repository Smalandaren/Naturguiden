using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class PlaceCategory
{
    public int PlaceId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string? Description { get; set; }

    public virtual AvailableCategory CategoryNameNavigation { get; set; } = null!;

    public virtual Place Place { get; set; } = null!;
}
