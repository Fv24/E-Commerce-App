using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;


namespace backend.Controllers
{
    //localhost:portX/api/products
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        public ProductsController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]

        public IActionResult GetProducts()
        {
            var products = dbContext.Products.ToList();

            return Ok(products);
        }

        [HttpGet("{id}")]

        public IActionResult GetProduct(int id) {

            var product = dbContext.Products.Find(id);

            if (product == null) {

                return NotFound("This product do not exist");
            }

            return Ok(product);
        }

        [HttpPost]

        public IActionResult AddProduct(AddProductDTO addProduct)
        {
            var productAdd = new Product()
            {
                Name = addProduct.Name,
                Description = addProduct.Description,
                Price = addProduct.Price,
                Image = addProduct.Image,
                Category = addProduct.Category,
                SubCategory = addProduct.SubCategory,
                Date = DateTime.UtcNow,
                Colors = addProduct.Colors,
                BestSeller = addProduct.BestSeller
            };

            dbContext.Products.Add(productAdd);

            dbContext.SaveChanges();

            return Ok(productAdd);
        }

        [HttpPut("{id}")]

        public IActionResult UpdateProduct(int id, UpdateProductDTO updateProduct)
        {
            var product = dbContext.Products.Find(id);

            if (product == null) {

                return NotFound("This product do not exist");
            }

            product.Name = updateProduct.Name;
            product.Description = updateProduct.Description;
            product.Price = updateProduct.Price;
            product.Image = updateProduct.Image;
            product.Category = updateProduct.Category;
            product.SubCategory = updateProduct.SubCategory;
            product.Colors = updateProduct.Colors;
            product.BestSeller = updateProduct.BestSeller;

            dbContext.SaveChanges();

            return Ok(product);
        }

        [HttpDelete("{id}")]

        public IActionResult DeleteProduct(int id) {

            var product = dbContext.Products.Find(id);

            if (product == null) {
                return NotFound("This product do not exist");
            }

            dbContext.Products.Remove(product);
            dbContext.SaveChanges();

            return Ok(); 
        }
    }
}
