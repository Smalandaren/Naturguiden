namespace Backend.DTO
{
    public class FriendDTO
    {
        public required int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required DateTime RequestTime { get; set; }
        public DateTime? ConfirmedTime { get; set; }
    }
}
