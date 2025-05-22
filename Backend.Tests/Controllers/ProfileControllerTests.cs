using Backend.Controllers;
using Backend.Interfaces;
using FakeItEasy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

// Namnkonvention för tester:
// MethodUnderTest_ExpectedBehavior_WhenCondition

namespace Backend.Tests.Controllers
{
    public class ProfileControllerTests
    {
        private readonly IProfileService _profileService;
        private readonly IPlacesService _placesService;
        private readonly ProfileController _profileController;

        public ProfileControllerTests()
        {
            _profileService = A.Fake<IProfileService>();
            _placesService = A.Fake<IPlacesService>();
            _profileController = new ProfileController(_profileService, _placesService);
        }

        [Fact]
        public async Task GetBasicProfileInfo_ReturnsOk_WhenUserIdIsValid()
        {
            // Arrange
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1")
            }, "mock"));

            _profileController.ControllerContext = new ControllerContext
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
            var result = await _profileController.GetBasicProfileInfo();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedProfile = Assert.IsType<ProfileBasicsDTO>(okResult.Value);
        }

        [Fact]
        public async Task GetBasicProfileInfo_ReturnsUnauthorized_WhenUserIdIsMissing()
        {
            // Arrange
            var user = new ClaimsPrincipal(new ClaimsIdentity());

            _profileController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            // Act
            var result = await _profileController.GetBasicProfileInfo();

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetForeignProfileInfo_ReturnsOk_WhenProfileExists()
        {
            // Arrange
            var profile = new ForeignProfileDTO
            {
                Id = 1,
                FirstName = "Test",
                LastName = "Testsson",
                VisitedPlaces = 2,
                CreatedAt = DateTime.UtcNow
            };

            A.CallTo(() => _profileService.GetForeignProfileInfoAsync(1)).Returns(profile);

            // Act
            var result = await _profileController.GetForeignProfileInfo(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedProfile = Assert.IsType<ForeignProfileDTO>(okResult.Value);
        }

        [Fact]
        public async Task GetForeignProfileInfo_ReturnsNotFound_WhenProfileDoesNotExist()
        {
            // Arrange
            A.CallTo(() => _profileService.GetForeignProfileInfoAsync(99)).Returns(Task.FromResult<ForeignProfileDTO?>(null));

            // Act
            var result = await _profileController.GetForeignProfileInfo(99);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetVisitedPlaces_ReturnsOk_WhenProfileExists()
        {
            // Arrange
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1")
            }, "mock"));

            _profileController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var places = new List<VisitedPlaceDTO>()
            {
                new VisitedPlaceDTO
                {
                    Id = 1,
                    Name = "Test 1",
                    Description = "Test 1",

                },
                new VisitedPlaceDTO
                {
                    Id = 2,
                    Name = "Test 2",
                    Description = "Test 2",

                }
            };

            A.CallTo(() => _placesService.GetVisitedPlacesByUserIdAsync(1)).Returns(places);

            // Act
            var result = await _profileController.GetVisitedPlaces();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetVisitedPlaces_ReturnsUnauthorized_WhenUserIdIsMissing()
        {
            // Arrange
            var user = new ClaimsPrincipal(new ClaimsIdentity());

            _profileController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            // Act
            var result = await _profileController.GetVisitedPlaces();

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
        }

        [Fact]
        public async Task UpdateProfile_ReturnsOk_WhenValidUserAndRequestBody()
        {
            // Arrange
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1")
            }, "mock"));

            _profileController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var updateRequest = new UpdateProfileRequest
            {
                FirstName = "Test",
                LastName = "Testsson"
            };

            var updatedProfile = new ProfileBasicsDTO
            {
                Id = 1,
                Email = "test@test.com",
                FirstName = "Test",
                LastName = "Testsson",
                Provider = "local",
                CreatedAt = DateTime.Now
            };

            A.CallTo(() => _profileService.UpdateProfileAsync(1, "Test", "Testsson")).Returns(updatedProfile);

            // Act
            var result = await _profileController.UpdateProfile(updateRequest);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public async Task UpdateProfile_ReturnsUnauthorized_WhenUserIdIsMissing()
        {
            // Arrange
            var user = new ClaimsPrincipal(new ClaimsIdentity());

            _profileController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var updateRequest = new UpdateProfileRequest
            {
                FirstName = "Test",
                LastName = "Testsson"
            };

            var updatedProfile = new ProfileBasicsDTO
            {
                Id = 1,
                Email = "test@test.com",
                FirstName = "Test",
                LastName = "Testsson",
                Provider = "local",
                CreatedAt = DateTime.Now
            };

            A.CallTo(() => _profileService.UpdateProfileAsync(1, "Test", "Testsson")).Returns(updatedProfile);

            // Act
            var result = await _profileController.UpdateProfile(updateRequest);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
        }

        [Fact]
        public async Task UpdateProfile_ReturnsBadRequest_WhenFirstNameMissing()
        {
            // Arrange
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1")
            }, "mock"));

            _profileController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var updateRequest = new UpdateProfileRequest
            {
                FirstName = "",
                LastName = "Testsson"
            };

            _profileController.ModelState.AddModelError("FirstName", "Required");

            // Act
            var result = await _profileController.UpdateProfile(updateRequest);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task UpdateProfile_ReturnsBadRequest_WhenLastNameMissing()
        {
            // Arrange
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1")
            }, "mock"));

            _profileController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var updateRequest = new UpdateProfileRequest
            {
                FirstName = "Test",
                LastName = ""
            };

            _profileController.ModelState.AddModelError("LastName", "Required");

            // Act
            var result = await _profileController.UpdateProfile(updateRequest);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        }
    }
}
