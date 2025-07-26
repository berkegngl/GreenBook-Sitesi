using GreenBooksAPI.Model;
using Dapper;
using GreenBooksAPI.Data;

namespace GreenBooksAPI.Services
{
    public class OrderService : IOrderService
    {

        private readonly DapperContext _context;

        public OrderService(DapperContext context)
        {
            _context = context;


        }


        public async Task<int> TakeOrderAsync(OrdersRequest order)
        {
            var sql = @"
INSERT INTO orders 
(isim, soyisim, urunler, toplam_tutar, adres,order_time)
VALUES 
(@Isim, @Soyisim, @UrunlerJson, @ToplamTutar, @Adres,@OrderTime)";


            using var conn = _context.CreateConnection();



            return await conn.ExecuteAsync(sql, new
            {
                order.Isim,
                order.Soyisim,
                UrunlerJson = order.UrunlerJson,
                order.ToplamTutar,
                order.Adres,
                OrderTime = DateTime.Now
            });

        }



        public async Task<IEnumerable<Orders>> ListOrdersAsync()
        {

            var sql = " SELECT * FROM orders";

            using var conn = _context.CreateConnection();
            var orders = await conn.QueryAsync<Orders>(sql);

            return orders;



        }

    }

}