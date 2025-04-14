using System.ComponentModel.DataAnnotations;

public class VisitRequest
{
    [Required]
    public required int UserId { get; set; }

    [Required]
    public required int PlaceId { get; set; }
}
