using Backend.Data;
using Backend.Models;
using Backend.DTO;

namespace Backend.Services
{
    public class ReviewService
    {
        private readonly ApplicationDbContext _context;

        public ReviewService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ReviewDTO>> GetReviews(int placeId)
        {
            List<Review> reviews = _context.Reviews.Where(e => e.PlaceId == placeId).ToList();
            List<ReviewDTO> reviewDTOs = new List<ReviewDTO>();
            for (int i = 0; i < reviews.Count(); i++)
            {
                User? user = await _context.Users.FindAsync(reviews[i].UserId);
                if (user == null) {user = new User() { FirstName = "Place", LastName = "Holder"};}

                reviewDTOs.Add(new ReviewDTO()
                {
                    Id = reviews[i].Id,
                    UserId = reviews[i].UserId,
                    PlaceId = reviews[i].PlaceId,
                    Rating = reviews[i].Rating,
                    Comment = reviews[i].Comment,
                    CreatedTimestamp = reviews[i].CreatedTimestamp,
                    UserName = (user.FirstName + " " + user.LastName)
                });
            }
            return reviewDTOs;
        }

        public async Task<bool> Create(Review review){
            try
            {
                await _context.Reviews.AddAsync(review);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
        }
    }
}
