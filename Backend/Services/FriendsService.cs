using Backend.Data;
using Backend.DTO;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class FriendsService
    {
        private readonly ApplicationDbContext _context;

        public FriendsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<FriendDTO>> GetFriends(int id) 
        {
            List<Friend> friends = await _context.Friends.Where(f => (f.SenderId == id || f.ReceiverId == id) && f.Confirmed).ToListAsync();

            List<FriendDTO> friendDTOs = new List<FriendDTO>();

            foreach (Friend f in friends)
            {
                int friendId = (id != f.ReceiverId) ? f.ReceiverId : f.SenderId;

                User friend = await _context.Users.FindAsync(friendId);

                FriendDTO friendDTO = new FriendDTO
                {
                    FirstName = friend.FirstName,
                    LastName = friend.LastName,
                    Email = friend.Email,
                    RequestTime = f.TimeSent,
                    ConfirmedTime = f.TimeConfirmed
                };
                friendDTOs.Add(friendDTO);
            }
            return friendDTOs;
        }

        public async Task<List<FriendDTO>> GetRequests(int id) 
        {
            var requests = await _context.Friends.Where(f => f.ReceiverId == id && !f.Confirmed).ToListAsync();
            List<FriendDTO> friendDTOs = new List<FriendDTO>();

            foreach (var f in requests) 
            {
                User sender = await _context.Users.FindAsync(f.SenderId);

                FriendDTO friendDTO = new FriendDTO
                {
                    FirstName = sender.FirstName,
                    LastName = sender.LastName,
                    Email = sender.Email,
                    RequestTime = f.TimeSent,
                    ConfirmedTime = f.TimeConfirmed
                };
                friendDTOs.Add(friendDTO);
            }
            return friendDTOs;
        }

        public async Task<bool> AddRequest(int senderId, int receiverId) 
        {
            if (await _context.Friends.FindAsync(receiverId, senderId) != null)
            { 
                return false;
            }
            _context.Friends.Add(new Friend
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Confirmed = false
            });
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
