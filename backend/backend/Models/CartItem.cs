using System.Text.Json.Serialization;

namespace backend.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        [JsonIgnore]
        public Cart? Cart { get; set; }

        public int ProductId { get; set; }
        public required string ProductName { get; set; }
        public required string Color { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
    }
}
