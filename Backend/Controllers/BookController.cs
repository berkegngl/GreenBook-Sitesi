using GreenBooksAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace GreenBooksAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BooksController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpGet("bestsellers")]
        public async Task<IActionResult> GetBestsellers()
        {
            var books = await _bookService.GetBestsellersAsync();
            return Ok(books);
        }

        [HttpGet("category/{category}")]
        public async Task<IActionResult> GetBooksByCategory(string category)
        {
            var books = await _bookService.GetBooksByCategoryAsync(category);
            return Ok(books);
        }

        [HttpGet("category/{category}/subcategory/{subcategory}")]
        public async Task<IActionResult> GetBooksByCategoryandSubcategory(string category,string subcategory)
        {
            var books = await _bookService.GetBooksByCategoryandSubcategoryAsync(category,subcategory);
            return Ok(books);
        }

        [HttpGet("discounted")]
        public async Task<IActionResult> GetDiscountedBooks()
        {
            var books = await _bookService.GetDiscountedBooksAsync();
            return Ok(books);
        }

    }
}
