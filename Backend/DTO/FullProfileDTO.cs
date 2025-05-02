public class FullProfileDTO
{
    public required int Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string Provider { get; set; }
    public string? ProviderId { get; set; }
    public bool IsAdmin { get; set; }
    public required DateTime CreatedAt { get; set; }
}