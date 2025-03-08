namespace backend.DTOs
{
    public class RoleResponseDTO
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public int TotalUsers { get; set; }
    }
}
