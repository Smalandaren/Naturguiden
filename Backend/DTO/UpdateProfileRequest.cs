using System.ComponentModel.DataAnnotations;

public class UpdateProfileRequest
{
    [Required]
    public required string FirstName { get; set; }

    [Required]
    public required string LastName { get; set; }
}
