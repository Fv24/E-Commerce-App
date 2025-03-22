using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;
using System.Security.Claims;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly string _stripeSecretKey;
        private readonly IConfiguration _configuration;
        public OrderController(ApplicationDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _stripeSecretKey = _configuration["Stripe:SecretKey"]; 
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

        //Create Stripe Order
        [Authorize]
        [HttpPost("PlaceOrderSTRIPE")]
        public async Task<IActionResult> PlaceOrderSTRIPE([FromBody] PlaceOrderRequestDTO request)
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
                    PaymentMethod = "stripe",
                    Date = DateTime.Now,
                    Status = "Order Placed",
                    Payment = false, // Initially false, will be updated when payment is verified
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
                }

                _dbContext.Orders.Add(order);
                await _dbContext.SaveChangesAsync(); 

                StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];

                var lineItems = new List<SessionLineItemOptions>();
                foreach (var item in request.Items)
                {
                    var productInfo = await _dbContext.Products.FindAsync(item.ProductId);
                    if (productInfo != null)
                    {
                        lineItems.Add(new SessionLineItemOptions
                        {
                            PriceData = new SessionLineItemPriceDataOptions
                            {
                                UnitAmount = (long)(productInfo.Price * 100),
                                Currency = "usd",
                                ProductData = new SessionLineItemPriceDataProductDataOptions
                                {
                                    Name = item.ProductName,
                                },
                            },
                            Quantity = item.Quantity,
                        });
                    }
                }

                var options = new SessionCreateOptions
                {
                    PaymentMethodTypes = new List<string> { "card" },
                    LineItems = lineItems,
                    Mode = "payment",
                    SuccessUrl = $"http://localhost:5173/success?success=true&orderId={order.Id}&session_id={{CHECKOUT_SESSION_ID}}",
                    CancelUrl = $"http://localhost:5173/success?success=false&orderId={order.Id}&session_id={{CHECKOUT_SESSION_ID}}",
                };

                var service = new SessionService();
                Session session = await service.CreateAsync(options);

                return Ok(new { success = true, session_url = session.Url });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while placing the order.", error = ex.Message });
            }
        }

        //Verify Payment
        [Authorize]
        [HttpPost("VerifyStripePayment")]
        public async Task<IActionResult> VerifyStripePayment([FromBody] VerifyStripeRequestDTO request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized(new { success = false, message = "User not authenticated." });
            }

            if (request == null || request.OrderId <= 0 || string.IsNullOrEmpty(request.SessionId) || string.IsNullOrEmpty(request.Success))
            {
                return BadRequest(new { success = false, message = "Invalid request data." });
            }

            try
            {
                var order = await _dbContext.Orders
                    .Include(o => o.Items)
                    .FirstOrDefaultAsync(o => o.Id == request.OrderId && o.UserId == userId);

                if (order == null)
                {
                    return NotFound(new { success = false, message = "Order not found for this user." });
                }

                if (request.Success == "false")
                {
                    order.Status = "Canceled";
                    await _dbContext.SaveChangesAsync();
                    return Ok(new { success = false, message = "Payment was not successful." });
                }

                StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];

                var sessionService = new SessionService();
                var session = await sessionService.GetAsync(request.SessionId);

                if (session == null || session.PaymentIntentId == null)
                {
                    return NotFound(new { success = false, message = "Stripe session not found or invalid." });
                }

                var paymentIntentService = new PaymentIntentService();
                var paymentIntent = await paymentIntentService.GetAsync(session.PaymentIntentId);

                if (paymentIntent.Status == "succeeded")
                {
                    order.Status = "Paid";
                    order.Payment = true;
                    await _dbContext.SaveChangesAsync();
                    
                    var cart = await _dbContext.Carts
                        .Include(c => c.Items)
                        .FirstOrDefaultAsync(c => c.UserId == userId);

                    if (cart != null)
                    {
                        var itemsToRemove = cart.Items
                            .Where(ci => order.Items.Any(oi => oi.ProductId == ci.ProductId))
                            .ToList();

                        if (itemsToRemove.Count > 0)
                        {
                            _dbContext.CartItems.RemoveRange(itemsToRemove);
                            await _dbContext.SaveChangesAsync();
                        }
                        else
                        {
                            Console.WriteLine("No items were found in the cart to delete.");
                        }
                    }

                    return Ok(new { success = true, message = "Payment verified successfully." });
                }
                else
                {
                    return BadRequest(new { success = false, message = "Payment not completed yet." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error verifying payment.", error = ex.Message });
            }
        }
    }
}
