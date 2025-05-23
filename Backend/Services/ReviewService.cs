using Backend.Data;
using Backend.Models;
using Backend.DTO;
using Backend.Interfaces;

namespace Backend.Services
{
    public class ReviewService
    {
        private readonly ApplicationDbContext _context;
        private readonly IProfileService _profileService;

        public ReviewService(ApplicationDbContext context, IProfileService profileService)
        {
            _context = context;
            _profileService = profileService;
        }

        public async Task<List<ReviewDTO>> GetReviews(int placeId)
        {
            List<Review> reviews = _context.Reviews.Where(e => e.PlaceId == placeId).OrderByDescending(e => e.CreatedTimestamp).ToList();
            List<ReviewDTO> reviewDTOs = new List<ReviewDTO>();
            for (int i = 0; i < reviews.Count(); i++)
            {
                User? user = await _context.Users.FindAsync(reviews[i].UserId);
                if (user == null) { user = new User() { FirstName = "Place", LastName = "Holder" }; }

                ForeignProfileDTO? reviewerProfile = await _profileService.GetForeignProfileInfoAsync(user.Id);

                reviewDTOs.Add(new ReviewDTO()
                {
                    Id = reviews[i].Id,
                    UserId = reviews[i].UserId,
                    ForeignProfile = reviewerProfile,
                    PlaceId = reviews[i].PlaceId,
                    Rating = reviews[i].Rating,
                    Comment = reviews[i].Comment,
                    CreatedTimestamp = reviews[i].CreatedTimestamp,
                    UserName = (user.FirstName + " " + user.LastName)
                });
            }
            return reviewDTOs;
        }

        public async Task<ReviewDTO?> Create(Review review)
        {
            try
            {
                await _context.Reviews.AddAsync(review);
                await _context.SaveChangesAsync();

                ForeignProfileDTO? reviewerProfile = null;
                if (review.UserId != null)
                {
                    reviewerProfile = await _profileService.GetForeignProfileInfoAsync(review.UserId.Value);
                }

                return new ReviewDTO
                {
                    Id = review.Id,
                    UserId = review.UserId,
                    PlaceId = review.PlaceId,
                    ForeignProfile = reviewerProfile,
                    Rating = review.Rating,
                    Comment = review.Comment,
                    CreatedTimestamp = review.CreatedTimestamp
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return null;
            }
        }
    }
}
