namespace Backend.DTO;

public class PlaceSuggestionSummaryDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? Address { get; set; }
    public int UserId { get; set; }
    public bool IsConfirmed { get; set; }
    public bool IsPublished { get; set; }
}
