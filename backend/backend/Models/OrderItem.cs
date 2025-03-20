using System.Text.Json.Serialization;

namespace backend.Models
{
    public class OrderItem
    {
            public int Id { get; set; } 
            public int OrderId { get; set; } 
            public int ProductId { get; set; }
            public int Quantity { get; set; }
            public string Color { get; set; }
            public string ProductName { get; set; }

            [JsonIgnore]
            public Order? Order { get; set; }
            public Product? Product { get; set; }
    }
}
