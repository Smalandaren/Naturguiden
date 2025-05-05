using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
    public class SearchTerm
    {
        [Required]
        public string SearchWord { get; set; }
    }
}
