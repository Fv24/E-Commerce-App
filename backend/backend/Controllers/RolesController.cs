using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Authorize(Roles ="Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly UserManager<User> userManager;

        public RolesController(RoleManager<IdentityRole> roleManager, UserManager<User> userManager)
        {
            this.roleManager = roleManager;
            this.userManager = userManager;
        }

        //api/Roles
        [HttpPost]

        public async Task<ActionResult> CreateRole([FromBody] CreateRoleDTO createRoleDTO)
        {
            if (string.IsNullOrEmpty(createRoleDTO.RoleName))
            {
                return BadRequest("Role name is required");
            }

            var roleExist = await roleManager.RoleExistsAsync(createRoleDTO.RoleName);

            if (roleExist)
            {
                return BadRequest("Role already exist");
            }

            var roleResult = await roleManager.CreateAsync(new IdentityRole(createRoleDTO.RoleName));

            if (roleResult.Succeeded) {
                return Ok(new {message="Role created successfully"});
            }

            return BadRequest("Role creation failed.");
        }


        //api/Roles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleResponseDTO>>> GetRoles()
        {
            var rolesList = await roleManager.Roles.ToListAsync();

            var roles = new List<RoleResponseDTO>();

            foreach (var role in rolesList)
            {
                var usersInRole = await userManager.GetUsersInRoleAsync(role.Name!); 

                roles.Add(new RoleResponseDTO
                {
                    Id = role.Id,
                    Name = role.Name,
                    TotalUsers = usersInRole.Count
                });
            }

            return Ok(roles);
        }

        //api/Roles/{id}
        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteRole(string id)
        {
            var role = await roleManager.FindByIdAsync(id);

            if (role == null)
            {
                return NotFound("Role not found");
            }

            var result = await roleManager.DeleteAsync(role);

            if (result.Succeeded)
            {
                return Ok(new { message = "Role deleted successfully." });
            }

            return BadRequest("Role deletion failed");
        }


        //api/Roles/asign
        [HttpPost("asign")]

        public async Task<IActionResult> AssignRole([FromBody] RoleAssignDTO roleAssignDTO)
        {
            var user = await userManager.FindByIdAsync(roleAssignDTO.UserId);

            if (user == null) {
                return NotFound("User not found");
            }

            var role = await  roleManager.FindByIdAsync(roleAssignDTO.RoleId);

            if (role == null) { 
                return NotFound("Role not found");
            }

            var result = await userManager.AddToRoleAsync(user,role.Name);

            if (result.Succeeded) {
                return Ok(new { message = "Role assigned successfully" });
            }

            var error = result.Errors.FirstOrDefault();

            return BadRequest(error.Description);
        }

        //api/Roles/update-role/{userId}
        [HttpPut("update-role/{userId}")]
        public async Task<ActionResult> UpdateUserRole(string userId, [FromBody] RoleUpdateRequest request)
        {
            var user = await userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound(new AuthResponseDTO
                {
                    IsSuccess = false,
                    Message = "User not found"
                });
            }

            var currentRoles = await userManager.GetRolesAsync(user);

            // Remove all current roles
            var removeRolesResult = await userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeRolesResult.Succeeded)
            {
                return BadRequest(new AuthResponseDTO
                {
                    IsSuccess = false,
                    Message = "Error removing current roles"
                });
            }

            // Add the new role
            var addRoleResult = await userManager.AddToRoleAsync(user, request.Role);
            if (!addRoleResult.Succeeded)
            {
                return BadRequest(new AuthResponseDTO
                {
                    IsSuccess = false,
                    Message = "Error adding new role"
                });
            }

            return Ok(new AuthResponseDTO
            {
                IsSuccess = true,
                Message = "Role updated successfully"
            });
        }
    }
}
