using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Review
{
    public int? Id { get; set; }

    /// <summary>
    /// Can be null due to deleted users
    /// </summary>
    public int? UserId { get; set; }

    public int PlaceId { get; set; }

    /// <summary>
    /// 1-5
    /// </summary>
    public int Rating { get; set; }

    public string Comment { get; set; } = null!;

    public DateTime CreatedTimestamp { get; set; }

    public virtual Place Place { get; set; } = null!;

    public virtual User? User { get; set; }
}
