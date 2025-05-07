namespace Backend.DTO
{
    public class FriendReqDTO
    {
        public required int SenderId { get; set; }
        public required int ReceiverId { get; set; }
    }
}
