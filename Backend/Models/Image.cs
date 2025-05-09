using Backend.Models;
using System.ComponentModel.DataAnnotations;

public class Image
{
    [Key]
    public int Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public int? PlaceId { get; set; }
    public Place? Place { get; set; }
    public string? Filename { get; set; }
    public int? PlaceSuggestionId { get; set; }
    public PlaceSuggestion? PlaceSuggestion { get; set; }
}
