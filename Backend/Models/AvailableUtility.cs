using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class AvailableUtility
{
    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public virtual ICollection<PlaceUtility> PlaceUtilities { get; set; } = new List<PlaceUtility>();
}
