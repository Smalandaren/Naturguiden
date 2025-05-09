using Backend.Models;
using System.ComponentModel.DataAnnotations;

public class AvailableCategory
{
    [Key]
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public virtual ICollection<PlaceCategory> PlaceCategories { get; set; } = new List<PlaceCategory>();
}
