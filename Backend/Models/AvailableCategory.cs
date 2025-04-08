using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class AvailableCategory
{
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<PlaceCategory> PlaceCategories { get; set; } = new List<PlaceCategory>();
}
