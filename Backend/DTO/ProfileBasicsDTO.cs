public class ProfileBasicsDTO
{
    public required int Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string Provider { get; set; }
    public required DateTime CreatedAt { get; set; }
}