using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class PlaceUtility
{
    public int PlaceId { get; set; }

    public string UtilityName { get; set; } = null!;

    public string? Description { get; set; }

    public virtual Place Place { get; set; } = null!;

    public virtual AvailableUtility UtilityNameNavigation { get; set; } = null!;
}
