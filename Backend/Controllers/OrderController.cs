using GreenBooksAPI.Services;
using Microsoft.AspNetCore.Mvc;
using GreenBooksAPI.Model;

namespace GreenBooksAPI.Controllers
{

    [ApiController]
    [Route("api/[controller]")]

    public class OrderController: ControllerBase

    {

        private readonly IOrderService _order;

        public OrderController(IOrderService order)
        {
            _order = order;
        }

        [HttpPost("TakeOrder")]
        public async Task<IActionResult> Register(OrdersRequest order)
        {
            var result = await _order.TakeOrderAsync(order);

            

            return Ok("Sipariş Alındı");
        }


        [HttpGet("ListOrders")]
        public async Task<IActionResult> LisOrders()
        {
            var orders = await _order.ListOrdersAsync();
            return Ok(orders);
        }


    }
}
