namespace Backend.Interfaces
{
    // Detta interface lades till för att underlätta för unit tester
    public interface IProfileService
    {
        Task<ProfileBasicsDTO?> GetBasicProfileInfoAsync(int id);
        Task<List<FullProfileDTO>> GetAllProfilesAsync();
        Task<bool> GetUserAdminStatusAsync(int id);
        Task<ForeignProfileDTO?> GetForeignProfileInfoAsync(int id);
        Task<ProfileBasicsDTO?> UpdateProfileAsync(int id, string firstName, string lastName);
    }
}