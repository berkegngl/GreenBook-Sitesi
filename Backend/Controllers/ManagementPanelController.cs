using GreenBooksAPI.Data;
using GreenBooksAPI.Model;
using GreenBooksAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace GreenBooksAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ManagementPanelController : ControllerBase
    {


        private readonly IManagementPanel _managementPanel;

        public ManagementPanelController(IManagementPanel managemetService)
        {
            _managementPanel = managemetService;


        }


            [HttpPost("add")]
        public async Task<IActionResult> AddBook([FromBody] BookManagement book)
        {
            var result = await _managementPanel.AddBookAsync(book);
            return result > 0 ? Ok("Kitap eklendi") : BadRequest("Ekleme başarısız");
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateBook([FromBody] BookUpdateRequest book)
        {
            if (book.Id <= 0)
                return BadRequest("Geçerli bir kitap ID'si girilmelidir.");

            var affectedRows = await _managementPanel.UpdateBookAsync(book);

            if (affectedRows == 0)
                return NotFound("Kitap bulunamadı veya hiçbir alan güncellenmedi.");

            return Ok("Kitap başarıyla güncellendi.");
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var result = await _managementPanel.DeleteBookAsync(id);
            return result > 0 ? Ok("Kitap silindi") : NotFound("Kitap bulunamadı");
        }

    }
}
