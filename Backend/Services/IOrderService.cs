using GreenBooksAPI.Model;

namespace GreenBooksAPI.Services
{
    public interface IOrderService
    {

        Task<int> TakeOrderAsync(OrdersRequest orders);

        Task<IEnumerable<Orders>> ListOrdersAsync();


    }
}
