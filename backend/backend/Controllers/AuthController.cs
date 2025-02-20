using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //api/auth
    public class AuthController : ControllerBase
    {

        private readonly UserManager<User> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration configuration;

        public AuthController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.configuration = configuration;
        }

        //api/auth/register
        [AllowAnonymous]
        [HttpPost("register")]

        public async Task<ActionResult<string>> Register(RegisterDTO registerDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new User {
                Name = registerDTO.Name,
                Email = registerDTO.Email,
                UserName = registerDTO.Email 
            }; 

            var result = await userManager.CreateAsync(user,registerDTO.Password);

            if (!result.Succeeded) { 
                return BadRequest(result.Errors);
            }

            if (registerDTO.Roles is null)
            {
                await userManager.AddToRoleAsync(user, "User");
            }
            else
            {
                foreach (var role in registerDTO.Roles)
                {

                    await userManager.AddToRoleAsync(user, role);
                }
            }

            return Ok(new
            {
                success = true,
                message = "Account Created Successfully!"
            });

        }

        //api/auth/register
        [AllowAnonymous]
        [HttpPost("login")]

        public async Task<ActionResult<AuthResponseDTO>> Login(LoginDTO loginDTO)
        {
            if (!ModelState.IsValid)
            {

                return BadRequest(ModelState);
            }

            var user = await userManager.FindByEmailAsync(loginDTO.Email);

            if (user == null)
            {
                return Unauthorized(new AuthResponseDTO
                {
                    IsSuccess = false,
                    Message = "User not found with this email"

                });
            }

            var result = await userManager.CheckPasswordAsync(user, loginDTO.Password);

            if (!result)
            {
                return Unauthorized(new AuthResponseDTO
                {
                    IsSuccess = false,
                    Message = "Invalid Password"
                });
            }

            var token = GenerateToken(user);

            return Ok(new
            {
                token = token,
                success = true,
                message = "Login Success"
            });

        }

            private string GenerateToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes(configuration.GetSection("JWTSetting").GetSection("securityKey").Value!);

            var roles = userManager.GetRolesAsync(user).Result;

            List<Claim> claims = [
                new (JwtRegisteredClaimNames.Email,user.Email ?? ""),
                new (JwtRegisteredClaimNames.Name, user.Name ?? ""),
                new (JwtRegisteredClaimNames.NameId,user.Id ?? ""),
                new (JwtRegisteredClaimNames.Aud,configuration.GetSection("JWTSetting").GetSection("validAudience").Value!),
                new (JwtRegisteredClaimNames.Iss, configuration.GetSection("JWTSetting").GetSection("validIssuer").Value!)
            ];

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));

            }
            var tokenDescroptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256   
                )
            };

            var token = tokenHandler.CreateToken(tokenDescroptor);

            return tokenHandler.WriteToken(token);

        }

        [Authorize]
        [HttpGet("detail")]

        public async Task<ActionResult<UserDTO>> GetUserDetail()
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await userManager.FindByIdAsync(currentUserId);

            if (user == null)
            {
                return NotFound(new AuthResponseDTO
                {
                    IsSuccess = false,
                    Message = "User not found"
                });
            }
                return Ok(new UserDTO
                {
                    Id = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    Roles = [..await userManager.GetRolesAsync(user)],
                    AccessFailedCount = user.AccessFailedCount,

                });
            
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            var usersList = await userManager.Users.ToListAsync();

            var users = new List<UserDTO>();

            foreach (var user in usersList)
            {
                var roles = await userManager.GetRolesAsync(user); // ✅ Await outside LINQ

                users.Add(new UserDTO
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Roles = roles.ToArray()
                });
            }

            return Ok(users);
        }

    }
}
