namespace NettbutikkAPI;

public class Product
{
    public Product(int id, string nameOfProduct, string typeOfProduct, int price, int stock, string imageUrl)
    {
        Id = id;
        NameOfProduct = nameOfProduct;
        TypeOfProduct = typeOfProduct;
        Price = price;
        Stock = stock;
        ImageUrl = imageUrl;
    }

    public int Id { get; private set; }
    public string NameOfProduct { get; private set; }
    public string TypeOfProduct { get; private set; }
    public int Price { get; private set; }
    public int Stock { get; private set; }
    public string ImageUrl { get; private set; }

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
}