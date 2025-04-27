// Detta är en DTO för Places som en använadre har besökt. Hade kanske inte behövt en egen DTO, men why not

public class VisitedPlaceDTO
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime VisitedAt { get; set; } // <----- Detta skiljer VisitedPlaceDTO från PlaceDTO
    public List<PlaceUtilityDTO>? PlaceUtilities { get; set; }
}
