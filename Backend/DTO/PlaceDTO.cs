using Backend.DTO;
public class PlaceDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public string? Address { get; set; }
    public bool Approved { get; set; }  
    public int? CreatedBy { get; set; } 
    public DateTime CreatedAt { get; set; }
    public List<string> ImageUrls { get; set; } = new();
    public List<PlaceUtilityDTO> PlaceUtilities { get; set; } = new();
    public List<CategoryDTO> Categories { get; set; } = new(); 
    public List<AttributeDTO> Attributes { get; set; } = new();  
}