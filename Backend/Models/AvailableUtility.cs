using Backend.Models;
using System.ComponentModel.DataAnnotations;

public class AvailableUtility
{
    [Key]
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public virtual ICollection<PlaceUtility> PlaceUtilities { get; set; } = new List<PlaceUtility>();

}
