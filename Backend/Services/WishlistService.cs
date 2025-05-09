using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class WishlistService
    {
        private readonly ApplicationDbContext _context;
        private readonly PlacesService _placesService;

        public WishlistService(ApplicationDbContext context)
        {
            _context = context;
            _placesService = new PlacesService(context);
        }

        
        public async Task<List<PlaceDTO>> GetWishlist(int userId) 
        {
            List<Wishlist> wishlistItems = await _context.Wishlist.Where(w => w.UserId == userId).ToListAsync();
            List<PlaceDTO> returnlist = new List<PlaceDTO>();

            foreach (Wishlist w in wishlistItems) 
            { 
                Place place = await _context.Places.FindAsync(w.PlaceId);

                PlaceDTO placeDTO = new PlaceDTO
                {
                    Id = place.Id,
                    Name = place.Name,
                    Description = place.Description,
                    Latitude = place.Latitude,
                    Longitude = place.Longitude,
                    CreatedAt = place.CreatedTimestamp,
                    PlaceUtilities = await _placesService.GetPlaceUtilitiesAsync(place.Id)
                };
                returnlist.Add(placeDTO);
            }
            return returnlist;
        }

    }
}
