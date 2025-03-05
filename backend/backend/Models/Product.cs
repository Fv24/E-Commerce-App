namespace backend.Models
{
    public class Product
    {
            public int Id { get; set; } 
            public required string Name { get; set; }
            public required string Description { get; set; }
            public double Price { get; set; }
            public required string Image { get; set; }
            public required string Category { get; set; }
            public required string SubCategory { get; set; }
            public required string Colors { get; set; } 
            public DateTime Date { get; set; } 
            public bool BestSeller { get; set; } 
    }
}
