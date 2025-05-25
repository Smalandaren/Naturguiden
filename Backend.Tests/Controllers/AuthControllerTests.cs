// Namnkonvention för tester:
// MethodUnderTest_ExpectedBehavior_WhenCondition

using Backend.Controllers;
using Backend.Interfaces;
using FakeItEasy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NaturguidenServerPrototype.Controllers;
using System.Security.Claims;

namespace Backend.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly IAuthService _authService;
        private readonly IProfileService _profileService;
        private readonly AuthController _authController;

        public AuthControllerTests()
        {
            _profileService = A.Fake<IProfileService>();
            _authService = A.Fake<IAuthService>();
            _authController = new AuthController(_authService, _profileService);
        }

        [Fact]
        public async Task CheckAuth_ReturnsOk_WhenUserIdIsValid()
        {
            // Arrange
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1")
            }, "mock"));

            _authController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var profile = new ProfileBasicsDTO
            {
                Id = 1,
                FirstName = "Test",
                LastName = "Testsson",
                Email = "test@test.com",
                Provider = "local",
                CreatedAt = DateTime.UtcNow
            };

            var authCheckResponse = new AuthCheckResponse
            {
                Authenticated = true,
                User = profile,
                IsAdmin = false
            };

            A.CallTo(() => _profileService.GetBasicProfileInfoAsync(1)).Returns(profile);
            A.CallTo(() => _profileService.GetUserAdminStatusAsync(1)).Returns(false);

            // Act
            var result = await _authController.CheckAuth();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedAuthCheck = Assert.IsType<AuthCheckResponse>(okResult.Value);
        }

        [Fact]
        public async Task CheckAuth_ReturnsUnauthorized_WhenUserIdIsMissing()
        {
            // Arrange
            var user = new ClaimsPrincipal(new ClaimsIdentity());

            _authController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            // Act
            var result = await _authController.CheckAuth();

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
        }
    }
}
