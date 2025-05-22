using Backend.Data;
using Backend.DTO;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Runtime.Serialization;

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

                User? friend = await _context.Users.FindAsync(friendId);
                if(friend != null)
                {
                    FriendDTO friendDTO = new FriendDTO
                    {
                        Id = friendId,
                        FirstName = friend.FirstName,
                        LastName = friend.LastName,
                        Email = friend.Email,
                        RequestTime = f.TimeSent,
                        ConfirmedTime = f.TimeConfirmed
                    };
                    friendDTOs.Add(friendDTO);
                }
            }
            return friendDTOs;
        }

        public async Task<List<FriendDTO>> GetRequests(int id) 
        {
            var requests = await _context.Friends.Where(f => f.ReceiverId == id && !f.Confirmed).ToListAsync();
            List<FriendDTO> friendDTOs = new List<FriendDTO>();

            foreach (var f in requests) 
            {
                User? sender = await _context.Users.FindAsync(f.SenderId);

                if(sender != null)
                {
                    FriendDTO friendDTO = new FriendDTO
                    {
                        Id = f.SenderId,
                        FirstName = sender.FirstName,
                        LastName = sender.LastName,
                        Email = sender.Email,
                        RequestTime = f.TimeSent,
                        ConfirmedTime = f.TimeConfirmed
                    };
                    friendDTOs.Add(friendDTO);
                }
                
            }
            return friendDTOs;
        }

        public async Task<bool> AddRequest(int senderId, int receiverId) 
        {
            if (await _context.Friends.FindAsync(receiverId, senderId) != null || await _context.Friends.FindAsync(senderId, receiverId) != null)
            { 
                return false;
            }
            _context.Friends.Add(new Friend
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Confirmed = false,
                TimeSent = DateTime.Now
            });
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AcceptRequest(int senderId, int receiverId)
        {
            Friend? friend = await _context.Friends.FirstOrDefaultAsync(f => f.SenderId == senderId && f.ReceiverId == receiverId);

            if (friend == null)
            {
                return false;
            }

            friend.Confirmed = true;
            friend.TimeConfirmed = DateTime.Now;
            
            _context.Friends.Update(friend);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveRequest(int senderId, int receiverId) 
        {
            Friend? friend = await _context.Friends.FirstOrDefaultAsync(f => (f.SenderId == senderId && f.ReceiverId == receiverId) || (f.SenderId == receiverId && f.ReceiverId == senderId));

            if (friend == null) 
            {
                return false;
            }

            _context.Friends.Remove(friend);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsFriends(int friendId, int userId)
        {
            Friend? friend =
                await _context.Friends.FirstOrDefaultAsync(f => (f.SenderId == friendId && f.ReceiverId == userId && f.Confirmed) || (f.SenderId == userId && f.ReceiverId == friendId && f.Confirmed));

            if (friend != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<int> IsRequested(int friendId, int userId)
        {
            Friend? friend = 
                await _context.Friends.FirstOrDefaultAsync(f => (f.SenderId == friendId && f.ReceiverId == userId && !f.Confirmed) || (f.SenderId == userId && f.ReceiverId == friendId && !f.Confirmed));

            if (friend != null)
            {
                return friend.SenderId;
            }
            else
            {
                return -1;
            }
        }
    }
}
