using System.ComponentModel.DataAnnotations;

public class ChangePasswordRequest
{
    [Required]
    public required string CurrentPassword { get; set; }

    [Required]
    public required string NewPassword { get; set; }
}
