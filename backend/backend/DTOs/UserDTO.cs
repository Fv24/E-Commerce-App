namespace backend.DTOs
{
    public class UserDTO
    {
        public required string Id { get; set; }

        public required string Name { get; set; }

        public required string Email { get; set; }

        public required string [] Roles { get; set; }

        public bool TwoFactorEnabled { get; set; }

        public int AccessFailedCount { get; set; }
    }
}
