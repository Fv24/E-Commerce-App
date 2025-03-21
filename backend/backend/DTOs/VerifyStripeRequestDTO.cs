namespace backend.DTOs
{
    public class VerifyStripeRequestDTO
    {
        public int OrderId { get; set; }
        public string SessionId { get; set; }
        public string Success { get; set; }
    }
}
