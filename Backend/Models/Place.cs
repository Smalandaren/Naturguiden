using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public partial class Place
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }

    public string? Address { get; set; }

    public bool Approved { get; set; }

    public List<AvailableCategory>? Categories { get; set; }
    public List<AvailableUtility>? Attributes { get; set; }

    /// <summary>
    /// Can be null due to deleted users
    /// </summary>
    public int? CreatedBy { get; set; }

    public DateTime CreatedTimestamp { get; set; }

    public virtual ICollection<Image> Images { get; set; } = new List<Image>();

    public virtual ICollection<PlaceCategory> PlaceCategories { get; set; } = new List<PlaceCategory>();

    public virtual ICollection<PlaceUtility> PlaceUtilities { get; set; } = new List<PlaceUtility>();

    public virtual ICollection<PlaceVisit> PlaceVisits { get; set; } = new List<PlaceVisit>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
