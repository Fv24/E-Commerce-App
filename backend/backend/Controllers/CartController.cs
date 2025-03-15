using Azure.Core;
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

        // GET: api/Cart
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
                    ProductId = cartItem.ProductId, // Ensure ProductId is stored
                    ProductName = cartItem.ProductName,
                    Color = cartItem.Color,
                    Quantity = cartItem.Quantity,
                    Price = cartItem.Price
                };

                _dbContext.CartItems.Add(newCartItem);
            }

            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "Product added to cart!" });
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateCart([FromBody] UpdateCart request)
        {
            Console.WriteLine($"🔹 Received update request: ItemId={request.ItemId}, ProductId={request.ProductId}, Color={request.Color}, Quantity={request.Quantity}");

            if (request == null || request.Quantity < 1)
                return BadRequest(new { message = "Invalid request data." });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized(new { message = "User not authenticated" });

            // ✅ Ensure the cart exists and is linked to the user
            var cart = await _dbContext.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return NotFound(new { message = "Cart not found for user" });
            }

            // Normalize and trim the color value for comparison
            var normalizedColor = request.Color.Trim().ToLower();

            // ✅ Find the correct item in the user's cart
            var existingItem = cart.Items.FirstOrDefault(i =>
                i.ProductId == request.ProductId &&
                i.Color.ToLower() == normalizedColor
            );

            if (existingItem == null)
            {
                Console.WriteLine($"❌ Item with ProductId {request.ProductId} and Color {request.Color} not found in user's cart!");
                return NotFound(new { message = "Item not found in cart", productId = request.ProductId, color = request.Color });
            }

            // ✅ Update the quantity and mark it as modified
            existingItem.Quantity = request.Quantity;
            _dbContext.CartItems.Update(existingItem);  // Explicitly mark entity as modified

            try
            {
                int changes = await _dbContext.SaveChangesAsync();
                Console.WriteLine($"✅ Database updated: {changes} row(s) affected.");

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
                Console.WriteLine($"❌ Database update error: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }



    }
}
