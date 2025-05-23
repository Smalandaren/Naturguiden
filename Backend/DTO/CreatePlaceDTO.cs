using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
    public class CreatePlaceDTO
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = null!;

        [Required]
        [StringLength(500)]
        public string Description { get; set; } = null!;

        [Required]
        [Range(-90, 90)]
        public decimal Latitude { get; set; }

        [Required]
        [Range(-180, 180)]
        public decimal Longitude { get; set; }

        [StringLength(200)]
        public string? Address { get; set; }

        public List<string> CategoryNames { get; set; } = new();

        public List<string> UtilityNames { get; set; } = new();
    }
}
