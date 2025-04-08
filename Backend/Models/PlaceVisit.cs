using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class PlaceVisit
{
    public int UserId { get; set; }

    public int PlaceId { get; set; }

    public DateTime CreatedTimestamp { get; set; }

    public virtual Place Place { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
