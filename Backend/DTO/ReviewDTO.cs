namespace Backend.DTO
{
    public class ReviewDTO
    {
        public int? Id { get; set; }

        public int? UserId { get; set; }

        public int PlaceId { get; set; }

        /// <summary>
        /// 1-5
        /// </summary>
        public int Rating { get; set; }

        public string? Comment { get; set; } = null!;

        public DateTime? CreatedTimestamp { get; set; }

        public string? UserName { get; set; }
    }
}
