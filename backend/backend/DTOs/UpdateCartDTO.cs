namespace backend.DTOs
{
    public class UpdateCartDTO
    {
        public int ItemId { get; set; }   
        public int ProductId { get; set; } 
        public required string Color { get; set; }
        public int Quantity { get; set; } 
    }
}
