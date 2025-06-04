// Namnkonvention för tester:
// MethodUnderTest_ExpectedBehavior_WhenCondition

using Backend.Controllers;
using Backend.Interfaces;
using Backend.Models;
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

        [Fact]
        public async Task Login_ReturnsBadRequest_WhenEmailIsInvalid()
        {
            // Arrange
            LoginRequest loginRequest = new LoginRequest
            { 
                Email = "test",
                Password = "test"
            };

            User user = new User();

            A.CallTo(() => _authService.AuthenticateAsync(loginRequest.Email, loginRequest.Password)).Returns(user);

            // Act
            var result = await _authController.Login(loginRequest);

            // Assert
            var badResult = Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Login_ReturnsBadRequest_WhenEmailIsEmpty()
        {
            // Arrange
            LoginRequest loginRequest = new LoginRequest
            {
                Email = "",
                Password = "test"
            };

            _authController.ModelState.AddModelError("Email", "Required");

            User user = new User();

            A.CallTo(() => _authService.AuthenticateAsync(loginRequest.Email, loginRequest.Password)).Returns(user);

            // Act
            var result = await _authController.Login(loginRequest);

            // Assert
            var badResult = Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Login_ReturnsBadRequest_WhenPasswordIsEmpty()
        {
            // Arrange
            LoginRequest loginRequest = new LoginRequest
            {
                Email = "test@test.com",
                Password = ""
            };

            _authController.ModelState.AddModelError("Password", "Required");

            User user = new User();

            A.CallTo(() => _authService.AuthenticateAsync(loginRequest.Email, loginRequest.Password)).Returns(user);

            // Act
            var result = await _authController.Login(loginRequest);

            // Assert
            var badResult = Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenInvalidCredentials()
        {
            // Arrange
            LoginRequest loginRequest = new LoginRequest
            {
                Email = "test@test.com",
                Password = "tes"
            };

            User user = new User();

            A.CallTo(() => _authService.AuthenticateAsync(loginRequest.Email, loginRequest.Password)).Returns(Task.FromResult<User?>(null));

            // Act
            var result = await _authController.Login(loginRequest);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task CanChangePassword_ReturnsUnauthorized_WhenUserIdIsMissing()
        {
            // Arrange
            var user = new ClaimsPrincipal(new ClaimsIdentity());

            _authController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            // Act
            var result = await _authController.CanChangePassword();

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
        }

        [Fact]
        public async Task CanChangePassword_ReturnsNotFound_WhenProfileDoesNotExist()
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

            A.CallTo(() => _profileService.GetBasicProfileInfoAsync(1)).Returns(Task.FromResult<ProfileBasicsDTO?>(null));

            // Act
            var result = await _authController.CanChangePassword();

            // Assert
            var notFoundResult = Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task CanChangePassword_ReturnsOk_WhenProfileProviderIsLocal()
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

            A.CallTo(() => _profileService.GetBasicProfileInfoAsync(1)).Returns(profile);

            // Act
            var result = await _authController.CanChangePassword();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public async Task CanChangePassword_ReturnsForbidden_WhenProfileProviderIsNotLocal()
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
                Provider = "google",
                CreatedAt = DateTime.UtcNow
            };

            A.CallTo(() => _profileService.GetBasicProfileInfoAsync(1)).Returns(profile);

            // Act
            var result = await _authController.CanChangePassword();

            // Assert
            var objectResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(403, objectResult.StatusCode);
        }

        [Fact]
        public async Task ChangePassword_ReturnsUnauthorized_WhenUserIdIsMissing()
        {
            // Arrange
            var user = new ClaimsPrincipal(new ClaimsIdentity());

            _authController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var changePasswordRequest = new ChangePasswordRequest
            {
                CurrentPassword = "123",
                NewPassword = "123456"
            };

            // Act
            var result = await _authController.ChangePassword(changePasswordRequest);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        }
    }
}
