﻿using Backend.DTO;
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
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdString, out int currentUserID))
            {
                return Unauthorized("Invalid user id");
            }

            var friends = await _friendsService.GetFriends(currentUserID);
            return Ok(friends);
        }

        [Authorize]
        [HttpGet("get-requests")]
        public async Task<ActionResult<List<FriendDTO>>> GetFriendRequests()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdString, out int currentUserID))
            {
                return Unauthorized("Invalid user id");
            }

            var requests = await _friendsService.GetRequests(currentUserID);
            return requests;
        }

        [Authorize]
        [HttpPost("send-request")]
        public async Task<IActionResult> AddRequest([FromBody] FriendReqDTO request)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdString, out int currentUserID))
            {
                return Unauthorized("Invalid user id");
            }

            await _friendsService.AddRequest(currentUserID, request.UserId);
            return Ok();
        }

        [Authorize]
        [HttpPut("accept-request")]
        public async Task<IActionResult> AcceptRequest([FromBody] FriendReqDTO request) 
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdString, out int currentUserID))
            {
                return Unauthorized("Invalid user id");
            }

            await _friendsService.AcceptRequest(request.UserId, currentUserID);
            return Ok();
        }

        [Authorize]
        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveRequest([FromBody] FriendReqDTO request)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdString, out int currentUserID))
            {
                return Unauthorized("Invalid user id");
            }

            await _friendsService.RemoveRequest(request.UserId, currentUserID);
            return Ok();
        }

        [Authorize]
        [HttpPost("check-friends")]
        public async Task<ActionResult<bool>> IsFriends([FromBody] FriendReqDTO request)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdString, out int currentUserID))
            {
                return Unauthorized("Invalid user id");
            }

            if (await _friendsService.IsFriends(request.UserId, currentUserID))
            {
                return Ok(true);
            }
            return Ok(false);
        }

        [Authorize]
        [HttpPost("check-request")]
        public async Task<ActionResult<int>> IsRequested([FromBody] FriendReqDTO request)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdString, out int currentUserID))
            {
                return Unauthorized("Invalid user id");
            }

            return Ok(await _friendsService.IsRequested(request.UserId, currentUserID));
        }
    }
}
