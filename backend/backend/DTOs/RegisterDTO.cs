using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class RegisterDTO
    {

        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; } = string.Empty;

        public List<string>? Roles { get; set; }
    }
}
