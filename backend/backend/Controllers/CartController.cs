using backend.Data;
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



        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] CartItem cartItem)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }

            // Check if the cart exists
            var cart = await _dbContext.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                _dbContext.Carts.Add(cart);
                await _dbContext.SaveChangesAsync();
            }

            // Find the existing item in the cart with the same product and color
            var existingCartItem = cart.Items
                .FirstOrDefault(ci => ci.ProductName == cartItem.ProductName && ci.Color == cartItem.Color);

            if (existingCartItem != null)
            {
                // Update quantity correctly
                existingCartItem.Quantity += 1;

            }
            else
            {
                // Add new item to cart
                var newCartItem = new CartItem
                {
                    CartId = cart.Id,
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


        // PUT: api/Cart
        [HttpPut]
        public async Task<IActionResult> UpdateCart([FromBody] CartItem item)
        {
            if (item == null) return BadRequest("Invalid cart item data.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            // Fetch the user's cart
            var cart = await _dbContext.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null) return NotFound(new { message = "Cart not found" });

            // Find the item in the cart
            var existingItem = cart.Items.FirstOrDefault(i => i.Id == item.Id && i.Color == item.Color);
            if (existingItem == null) return NotFound(new { message = "Item not found in cart" });

            // Update the item's quantity to 0 or any other value
            existingItem.Quantity = item.Quantity;

            // Save changes to the cart
            await _dbContext.SaveChangesAsync();

            // Return the updated cart data
            return Ok(new { message = "Cart updated", cart = cart.Items });
        }

      


    }
}
