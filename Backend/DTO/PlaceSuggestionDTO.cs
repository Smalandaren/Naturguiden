using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
    public class PlaceSuggestionDTO
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }

        public string? Address { get; set; }

        public List<string>? CategoryNames { get; set; } 

        public List<string>? AttributeNames { get; set; }

        public List<string>? ImageUrls { get; set; }

        [Required]
        public string UserName { get; set; } = string.Empty;
    }
}
