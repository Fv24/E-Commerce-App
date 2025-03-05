using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

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

        // Place Order
        [HttpPost("PlaceOrder")]
        public ActionResult<Order> PlaceOrder([FromBody] Order order)
        {
            // Validate the incoming request data
            if (order.Items == null || order.Items.Count == 0)
            {
                return BadRequest("Order must contain at least one item.");
            }

          

            // Add the order to the database
            _dbContext.Orders.Add(order);
            _dbContext.SaveChanges();

            // Return the created order with a 201 Created status and location header
            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
        }

        // Place Order with Stripe
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

        // Get all orders
        [HttpGet("AllOrders")]
        public ActionResult<IEnumerable<Order>> AllOrders()
        {
            var orders = _dbContext.Orders.ToList();
            return Ok(orders); // Return all orders
        }

        // Get orders for a specific user
        [HttpGet("UserOrderData/{userId}")]
        public ActionResult<IEnumerable<Order>> UserOrderData(int userId)
        {
            var userOrders = _dbContext.Orders.Where(o => o.UserId == userId).ToList();
            if (!userOrders.Any())
                return NotFound("No orders found for this user.");
            return Ok(userOrders);
        }

        // Update order status
        [HttpPut("UpdateStatus/{id}")]
        public ActionResult UpdateStatus(int id, [FromBody] string newStatus)
        {
            var order = _dbContext.Orders.FirstOrDefault(o => o.Id == id);
            if (order == null)
                return NotFound("Order not found.");

            order.Status = newStatus; // Update status
            _dbContext.SaveChanges(); // Save changes to the database
            return NoContent(); // Return empty response to indicate success
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
