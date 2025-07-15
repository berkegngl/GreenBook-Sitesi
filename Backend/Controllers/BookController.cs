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

        [HttpGet("General")]
        public async Task<IActionResult> General()
        {
            var counts = await _bookService.General();
            return Ok(counts);
        }

       

        [HttpGet("discounted")]
        public async Task<IActionResult> GetDiscountedBooks()
        {
            var books = await _bookService.GetDiscountedBooksAsync();
            return Ok(books);
        }

        [HttpGet("AllBooks")]
        public async Task<IActionResult> GetAllBooksAsync()
        {
            var books = await _bookService.GetAllBooksAsync();
            return Ok(books);
        }

        [HttpGet("filter")]
        public async Task<IActionResult> FilterBooks(
    [FromQuery] string? category,
    [FromQuery] string? subcategory,
    [FromQuery] string? author,
    [FromQuery] string? publisher)
        {
            var books = await _bookService.FilterBooksAsync(category, subcategory, author, publisher);
            return Ok(books);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchBooks([FromQuery] string query)
        {
            var result = await _bookService.SearchBooksAsync(query);
            return Ok(result);
        }




    }
}
