using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public CartController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //GET /api/Cart
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null) return Unauthorized();

                var cart = await _dbContext.Carts
                    .Include(c => c.Items)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null)
                {
                    cart = new Cart { UserId = userId };
                    _dbContext.Carts.Add(cart);
                    await _dbContext.SaveChangesAsync();
                }

                return Ok(cart);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        //AddCart
        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] CartItem cartItem)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }

            var cart = await _dbContext.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                _dbContext.Carts.Add(cart);
                await _dbContext.SaveChangesAsync();
            }

            var existingCartItem = cart.Items
                .FirstOrDefault(ci => ci.ProductId == cartItem.ProductId && ci.Color == cartItem.Color);

            if (existingCartItem != null)
            {
                existingCartItem.Quantity += 1;
            }
            else
            {
                var newCartItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = cartItem.ProductId,
                    ProductName = cartItem.ProductName,
                    Color = cartItem.Color,
                    Quantity = cartItem.Quantity,
                    Price = cartItem.Price
                };

                _dbContext.CartItems.Add(newCartItem);
                await _dbContext.SaveChangesAsync();

                return Ok(newCartItem);
            }

            await _dbContext.SaveChangesAsync();
            return Ok(existingCartItem); 
        }

        //UpdateQuantity
        [HttpPut("update")]
        public async Task<IActionResult> UpdateCart([FromBody] UpdateCartDTO request)
        {
            if (request == null || request.Quantity < 1)
                return BadRequest(new { message = "Invalid request data." });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized(new { message = "User not authenticated" });

            var cart = await _dbContext.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return NotFound(new { message = "Cart not found for user" });
            }

            var normalizedColor = request.Color.Trim().ToLower();

            var existingItem = cart.Items.FirstOrDefault(i =>
                i.ProductId == request.ProductId &&
                i.Color.ToLower() == normalizedColor
            );

            if (existingItem == null)
            {
                return NotFound(new { message = "Item not found in cart", productId = request.ProductId, color = request.Color });
            }

            existingItem.Quantity = request.Quantity;
            _dbContext.CartItems.Update(existingItem); 

            try
            {
                int changes = await _dbContext.SaveChangesAsync();

                if (changes > 0)
                {
                    return Ok(new { message = "Quantity updated successfully", cart = cart.Items });
                }
                else
                {
                    return StatusCode(500, new { message = "Database did not save the changes" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        //RemoveItem
        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveItem([FromBody] RemoveCartItemDTO request)
        {
            if (request == null || request.ProductId == 0 || string.IsNullOrWhiteSpace(request.Color))
                return BadRequest(new { message = "Invalid request data." });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized(new { message = "User not authenticated" });

            var cart = await _dbContext.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || !cart.Items.Any())
                return NotFound(new { message = "Cart is empty or does not exist" });

            var normalizedColor = request.Color.Trim().ToLower();

            var itemToRemove = cart.Items.FirstOrDefault(i =>
                i.ProductId == request.ProductId &&
                i.Color.ToLower() == normalizedColor
            );

            if (itemToRemove == null)
            {
                return NotFound(new { message = "Item not found in cart", productId = request.ProductId, color = request.Color });
            }

            _dbContext.CartItems.Remove(itemToRemove);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Item removed successfully", cart = cart.Items });
        }
    }
}
