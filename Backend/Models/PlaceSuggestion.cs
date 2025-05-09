using Backend.Models;

public class PlaceSuggestion
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? Address { get; set; }

    public List<AvailableCategory>? Categories { get; set; }
    public List<AvailableUtility>? Attributes { get; set; }

    public List<Image>? Images { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public bool IsConfirmed { get; set; } = false;
}
