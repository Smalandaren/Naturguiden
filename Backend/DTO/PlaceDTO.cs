public class PlaceDTO
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Address { get; set; }
    public List<PlaceUtilityDTO>? PlaceUtilities { get; set; } // = new(); om det ska vara en tom array istället för null
    public List<PlaceCategoryDTO>? PlaceCategories { get; set; }
    public List<string> Images { get; set; } = new();
}