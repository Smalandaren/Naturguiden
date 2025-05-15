namespace Backend.Models
{
    public class Wishlist
    {
        public int UserId { get; set; }

        public int PlaceId { get; set; }

        public virtual Place Place { get; set; } = null!;
        
        public virtual User User { get; set; } = null!;
    }
}
