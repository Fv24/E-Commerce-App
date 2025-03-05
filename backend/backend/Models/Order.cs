namespace backend.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public List<CartItem> Items { get; set; } = new List<CartItem>();

        public double Amount { get; set; }

        public required string Address  { get; set; }

        public required string Status { get; set; } = "Order Placed";

        public required string PaymentMethod { get; set; }

        public bool Payment {  get; set; } = false;

        public DateTime Date { get; set; }
    }
}
