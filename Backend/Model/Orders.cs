namespace GreenBooksAPI.Model;

public class Orders
{
    public int SiparisNo { get; set; } 
    public string Isim { get; set; } 
    public string Soyisim { get; set; } 
    public string UrunlerJson { get; set; } 
    public decimal ToplamTutar { get; set; }
    public string Adres { get; set; } 
}

