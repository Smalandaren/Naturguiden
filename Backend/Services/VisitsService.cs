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
        return await _context.PlaceVisits.FindAsync(placeID, userID) != null; //Returnerar true om den finns, annars false
    }

    public async Task<bool> RegisterVisit(PlaceVisit visit)
    {
        if(await _context.PlaceVisits.FindAsync(visit.PlaceId, visit.UserId) != null)
        {
            return false;
        }
        _context.Add(new PlaceVisit { PlaceId = visit.PlaceId, UserId = visit.UserId, CreatedTimestamp = DateTime.UtcNow });
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveVisit(PlaceVisit visit)
    {
        if (await _context.PlaceVisits.FindAsync(visit.PlaceId, visit.UserId) == null)
        {
            return false;
        }
        _context.Remove(_context.PlaceVisits.FindAsync(visit.PlaceId, visit.UserId));
        await _context.SaveChangesAsync();
        return true;
    }
}
