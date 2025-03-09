using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class RegisterDTO
    {

        [Required]
        public required string Name { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public string Password { get; set; } = string.Empty;

        public List<string>? Roles { get; set; }
    }
}
