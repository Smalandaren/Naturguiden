using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Image
{
    public int PlaceId { get; set; }

    public string Filename { get; set; } = null!;

    public virtual Place Place { get; set; } = null!;
}
