using Backend.DTO;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendsController : ControllerBase
    {
        private readonly FriendsService _friendsService;
        public FriendsController(FriendsService friendsService)
        {
            _friendsService = friendsService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<FriendDTO>>> GetFriends()
        {
            int currentUserID = Int32.Parse(this.User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var friends = await _friendsService.GetFriends(currentUserID);
            return Ok(friends);
        }

        [Authorize]
        [HttpGet("get-requests")]
        public async Task<ActionResult<List<FriendDTO>>> GetFriendRequests()
        {
            int currentUserID = Int32.Parse(this.User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var requests = await _friendsService.GetRequests(currentUserID);
            return requests;
        }

        [Authorize]
        [HttpPost("send-request")]
        public async Task<IActionResult> AddRequest([FromBody] FriendReqDTO request)
        {
            await _friendsService.AddRequest(request.SenderId, request.ReceiverId);
            return Ok();
        }

        [Authorize]
        [HttpPut("accept-request")]
        public async Task<IActionResult> AcceptRequest([FromBody] FriendReqDTO request) 
        {
            await _friendsService.AcceptRequest(request.SenderId, request.ReceiverId);
            return Ok();
        }
    }
}
