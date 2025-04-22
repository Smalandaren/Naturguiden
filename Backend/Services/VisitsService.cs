using Backend.Data;
using Backend.Models;
using System.Threading.Tasks;


public class VisitsService
{
    private readonly ApplicationDbContext _context;

    public VisitsService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HasVisited(int placeID, int userID)
    {
        return await _context.PlaceVisits.FindAsync(userID, placeID) != null; //Returnerar true om den finns, annars false
    }

    public async Task<bool> RegisterVisit(PlaceVisit visit)
    {
        if(await _context.PlaceVisits.FindAsync(visit.UserId, visit.PlaceId) != null)
        {
            return false;
        }
        _context.PlaceVisits.Add(new PlaceVisit { PlaceId = visit.PlaceId, UserId = visit.UserId});
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveVisit(PlaceVisit request)
    {
        if (await _context.PlaceVisits.FindAsync(request.UserId, request.PlaceId) == null)
        {
            return false;
        }
        _context.PlaceVisits.Remove(await _context.PlaceVisits.FindAsync(request.UserId, request.PlaceId));
        await _context.SaveChangesAsync();
        return true;
    }
}
