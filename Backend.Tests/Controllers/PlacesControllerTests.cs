using Backend.Controllers;
using Backend.Interfaces;
using FakeItEasy;
using Microsoft.AspNetCore.Mvc;

// Namnkonvention för tester:
// MethodUnderTest_ExpectedBehavior_WhenCondition

namespace Backend.Tests.Controllers
{
    public class PlacesControllerTests
    {
        private readonly IPlacesService _placesService;
        private readonly PlacesController _placesController;

        public PlacesControllerTests()
        {
            _placesService = A.Fake<IPlacesService>();
            _placesController = new PlacesController(_placesService);
        }

        [Fact]
        public async Task Get_ReturnsOkResult_WhenPlaceExists()
        {
            // Arrange
            var placeDTO = new PlaceDTO
            {
                Id = 1,
                Name = "Test ställe",
                Description = "Test beskrivning",
                Latitude = 1.23M, // "M" omvanldar från double till decimal
                Longitude = 4.56M,
                CreatedAt = DateTime.UtcNow,
            };

            A.CallTo(() => _placesService.GetAsync(1)).Returns(Task.FromResult<PlaceDTO?>(placeDTO));

            // Act
            var result = await _placesController.Get(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedPlace = Assert.IsType<PlaceDTO>(okResult.Value);
        }

        [Fact]
        public async Task Get_ReturnsNotFound_WhenPlaceDoesNotExist()
        {
            // Arrange
            A.CallTo(() => _placesService.GetAsync(-1)).Returns(Task.FromResult<PlaceDTO?>(null));

            // Act
            var result = await _placesController.Get(-1);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundResult>(result.Result);
        }
    }
}
