namespace NettbutikkAPI;

public class Product
{
    public int Id { get; private set; }
    public string NameOfProduct { get; private set; }
    public string TypeOfProduct { get; private set; }
    public double Price { get; private set; }
    public int Stock { get; private set; }
    public string ImageUrl { get; private set; }
    public bool IsOnSale { get; private set; }
    public double PriceModifier { get; private set; }

    public Product(int id, string nameOfProduct, string typeOfProduct, double price, int stock, string imageUrl, bool isOnSale, double priceModifier)
    {
        Id = id;
        NameOfProduct = nameOfProduct;
        TypeOfProduct = typeOfProduct;
        Price = price;
        Stock = stock;
        ImageUrl = imageUrl;
        IsOnSale = isOnSale;
        PriceModifier = priceModifier;
    }
    public void SetStock(int updatedProductStock)
    {
        Stock = updatedProductStock;
    }


    public void SetId(int allproductsCount)
    {
        Id = allproductsCount;
    }

    public void addStock(int stock)
    {
        Stock += stock;
    }

    public void SetPriceModifier(double updatedProductPriceModifier)
    {
        PriceModifier = updatedProductPriceModifier;
    }

    public void SetSale(bool updatedProductIsOnSale)
    {
        IsOnSale = updatedProductIsOnSale;
    }
}