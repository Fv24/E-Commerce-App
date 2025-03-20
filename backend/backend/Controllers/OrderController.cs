using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public OrderController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //Create Order
        [Authorize]
        [HttpPost("PlaceOrder")]
        public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderRequestDTO request)
        {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            if (request == null || request.Items == null || request.Items.Count == 0)
            {
                return BadRequest(new { message = "Invalid order data." });
            }

            try
            {
                var cart = await _dbContext.Carts
                    .Include(c => c.Items)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null || cart.Items == null || cart.Items.Count == 0)
                {
                    return BadRequest(new { message = "Cart is empty or not found." });
                }

                var order = new Order
                {
                    UserId = userId,
                    Address = request.Address,
                    Amount = request.Amount,
                    PaymentMethod = request.PaymentMethod,
                    Date = DateTime.Now,
                    Status = "Order Placed",
                    Payment = request.Payment ? true : false // If method is cod is false
                };

                foreach (var item in request.Items)
                {
                    order.Items.Add(new OrderItem
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        Color = item.Color,
                        ProductName = item.ProductName,
                    });

                    var cartItem = cart.Items.FirstOrDefault(ci => ci.ProductId == item.ProductId);
                    if (cartItem != null)
                    {
                        _dbContext.CartItems.Remove(cartItem);
                    }
                }

                _dbContext.Orders.Add(order);
                await _dbContext.SaveChangesAsync();

                await _dbContext.SaveChangesAsync();

                return Ok(new { success = true, message = "Order placed successfully", orderId = order.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while placing the order.", error = ex.Message });
            }
        }

        //Get user order
        [Authorize]
        [HttpGet("UserOrderData")]
        public async Task<IActionResult> GetUserOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            try
            {
                var orders = await _dbContext.Orders
                    .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                    .Where(o => o.UserId == userId)
                    .ToListAsync();

                var orderDtos = orders.Select(o => new
                {
                    o.Id,
                    o.Status,
                    o.PaymentMethod,
                    o.Payment,
                    Date = o.Date.ToString("yyyy-MM-dd"), 
                    Items = o.Items.Select(i => new
                    {
                        i.ProductName,
                        i.Quantity,
                        i.Color,
                        i.ProductId,
                        Price = i.Product.Price, 
                        ImageUrl = i.Product.Image 
                    }).ToList()
                }).ToList();

                return Ok(new { success = true, orders = orderDtos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred", error = ex.Message });
            }
        }

        //GetAllOrders
        [Authorize]
        [HttpGet("AllOrders")]
        public ActionResult<IEnumerable<Order>> AllOrders()
        {
            var orders = _dbContext.Orders
                .Include(o => o.Items)
                .ToList(); 

            if (orders == null || orders.Count == 0)
            {
                return NotFound(new { success = false, message = "No orders found" });
            }

            return Ok(new { success = true, orders });
        }

        //Update Status
        [HttpPut("UpdateStatus/{id}")]
        public ActionResult UpdateStatus(int id, [FromBody] string newStatus)
        {
            var order = _dbContext.Orders.FirstOrDefault(o => o.Id == id);
            if (order == null)
                return NotFound("Order not found.");

            order.Status = newStatus; 
            _dbContext.SaveChanges();

            return Ok(new { success = true, message = "Order status updated successfully." });
        }
    



        [HttpPost("PlaceOrderSTRIPE")]
        public ActionResult<Order> PlaceOrderSTRIPE([FromBody] Order order)
        {
            // Handle Stripe payment logic (e.g., payment gateway integration)
            order.PaymentMethod = "Stripe";
            order.Payment = true; // Assume successful payment
            order.Date = DateTime.Now;

            // Add the order to the database
            _dbContext.Orders.Add(order);
            _dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
        }

        // Place Order with PayPal
        [HttpPost("PlaceOrderPayPal")]
        public ActionResult<Order> PlaceOrderPayPal([FromBody] Order order)
        {
            // Handle PayPal payment logic (e.g., payment gateway integration)
            order.PaymentMethod = "PayPal";
            order.Payment = true; // Assume successful payment
            order.Date = DateTime.Now;

            // Add the order to the database
            _dbContext.Orders.Add(order);
            _dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
        }

       


   

        // Get an order by its ID
        [HttpGet("{id}")]
        public ActionResult<Order> GetOrderById(int id)
        {
            var order = _dbContext.Orders.FirstOrDefault(o => o.Id == id);
            if (order == null)
                return NotFound("Order not found.");
            return Ok(order);
        }


    }
}
