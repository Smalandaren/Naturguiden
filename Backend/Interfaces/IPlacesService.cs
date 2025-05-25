using Backend.DTO;
namespace Backend.Interfaces
{
    // Detta interface lades till för att underlätta för unit tester
    public interface IPlacesService
    {
        Task<List<PlaceDTO>> GetAllAsync();
        Task<PlaceDTO?> GetAsync(int id);
        Task<List<PlaceUtilityDTO>> GetPlaceUtilitiesAsync(int placeId);
        Task<string?> GetGeneralPlaceUtilityDescriptionAsync(string utilityName);
        Task<List<VisitedPlaceDTO>> GetVisitedPlacesByUserIdAsync(int userId);
        Task<int> CreateAsync(CreatePlaceDTO dto, int userId);
        Task<List<PlaceDTO>> GetPendingAsync();
        Task<bool> ApproveAsync(int placeId);
        Task<bool> DeleteAsync(int id);
        Task<(bool success, string message, string? filename)> UploadImageAsync(int placeId, IFormFile file);
    }
}
