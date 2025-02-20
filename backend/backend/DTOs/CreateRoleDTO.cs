using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateRoleDTO
    {
        [Required(ErrorMessage = "Role name is required.")]
        public string RoleName { get; set; } = null;
    }
}
