using backend.Models;

namespace backend.DTOs
{
    public class PlaceOrderRequestDTO
    {
        public string Address { get; set; }
        public double Amount { get; set; }
        public string PaymentMethod { get; set; }
        public bool Payment { get; set; }
        public List<OrderItem> Items { get; set; }
    }
}
