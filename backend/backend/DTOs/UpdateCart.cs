namespace backend.DTOs
{
    public class UpdateCart
    {
        public int ItemId { get; set; }   // ID of the CartItem
        public int ProductId { get; set; } // Ensure ProductId is included
        public string Color { get; set; }
        public int Quantity { get; set; }  // New quantity to set
    }
}
