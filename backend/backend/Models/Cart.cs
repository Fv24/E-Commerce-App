using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Cart
    {
        public int Id { get; set; }

   
        public required string UserId { get; set; }
        public  List<CartItem> Items { get; set; }=new List<CartItem>();  
    }



}
