using System.Text.Json;

namespace NettbutikkAPI;

public class ProductManager
{
    private readonly List<Product> _products;

    public ProductManager(string filePath)
    {
        if (File.Exists(filePath))
        {
            var json = File.ReadAllText(filePath);
            _products = JsonSerializer.Deserialize<List<Product>>(json);
        }
        else
        {
            _products =
            [
                new Product(0, "Hat", "Klær", 49.50, 150, "IMG/productIMG/hatt.jpg", true, 1.1),
                new Product(1, "Dusjhette", "Klær", 99.90, 120, "IMG/productIMG/showercap.jpg", false, 1.1),
                new Product(2, "Blyant", "Kontor", 15.90, 100, "IMG/productIMG/blyant.jpg", false, 1.1),
                new Product(3, "Gaffatape", "Kontor", 35.90, 130, "IMG/productIMG/tape.jpg", false, 1.1),
                new Product(4, "Dinosaur", "Leker", 149.90, 70, "IMG/productIMG/dinosaur.jpg", false, 1.1),
                new Product(5, "Banan", "Mat", 8.95, 180, "IMG/productIMG/banan.jpg", true, 1.1),
                new Product(6, "Dopapir", "Mat", 49.90, 100, "IMG/productIMG/dopapir.jpg", false, 1.1),
                new Product(7, "Redbull", "Drikke", 35.90, 90, "IMG/productIMG/energi.jpg", false, 1.1),
                new Product(8, "Eple", "Mat", 7.90, 60, "IMG/productIMG/eple.jpg", false, 1.1),
                new Product(9, "Melk", "Drikke", 22.90, 140, "IMG/productIMG/melk.jpg", false, 1.1),
                new Product(10, "Sjokolade", "Mat", 35.90, 80, "IMG/productIMG/sjokolade.jpg", false, 1.1),
                new Product(11, "Brød", "Mat", 30.90, 200, "IMG/productIMG/bread.jpg", false, 1.1),
                new Product(12, "Ost", "Mat", 60.90, 160, "IMG/productIMG/cheese.jpg", false, 1.1),
                new Product(13, "Salami", "Mat", 80.90, 120, "IMG/productIMG/salami.jpg", false, 1.1),
                new Product(14, "Smør", "Mat", 40.90, 140, "IMG/productIMG/butter.jpg", true, 1.1),
                new Product(15, "Sukker", "Mat", 50.90, 180, "IMG/productIMG/sugar.jpg", false, 1.1),
                new Product(16, "Salt", "Mat", 10.90, 100, "IMG/productIMG/salt.jpg", false, 1.1),
                new Product(17, "Pepper", "Mat", 20.90, 90, "IMG/productIMG/pepper.jpg", false, 1.1),
                new Product(18, "Ketchup", "Mat", 25.90, 170, "IMG/productIMG/ketchup.jpg", true, 1.1),
                new Product(19, "Majones", "Mat", 28.90, 130, "IMG/productIMG/mayo.jpg", false, 1.1),
                new Product(20, "Potetgull", "Mat", 35.90, 190, "IMG/productIMG/chips.jpg", false, 1.1),
                new Product(21, "Soda", "Drikke", 25.90, 80, "IMG/productIMG/soda.jpg", false, 1.1),
                new Product(22, "Juice", "Drikke", 30.90, 110, "IMG/productIMG/juice.jpg", false, 1.1),
                new Product(23, "Kaffe", "Drikke", 40.90, 150, "IMG/productIMG/coffee.jpg", false, 1.1),
                new Product(24, "Te", "Drikke", 20.90, 130, "IMG/productIMG/tea.jpg", false, 1.1),
                new Product(25, "Vann", "Drikke", 15.90, 140, "IMG/productIMG/water.jpg", false, 1.1),
                new Product(26, "T-skjorte", "Klær", 99.90, 100, "IMG/productIMG/tshirt.jpg", false, 1.1),
                new Product(27, "Bukse", "Klær", 150.90, 110, "IMG/productIMG/pants.jpg", false, 1.1),
                new Product(28, "Genser", "Klær", 200.90, 120, "IMG/productIMG/sweater.jpg", true, 1.1),
                new Product(29, "Skjørt", "Klær", 120.90, 70, "IMG/productIMG/skirt.jpg", false, 1.1),
                new Product(30, "Jakke", "Klær", 250.90, 60, "IMG/productIMG/jacket.jpg", false, 1.1),
                new Product(31, "Notatbok", "Kontor", 40.90, 100, "IMG/productIMG/notebook.jpg", false, 1.1),
                new Product(32, "Stiftemaskin", "Kontor", 45.90, 90, "IMG/productIMG/stapler.jpg", false, 1.1),
                new Product(33, "Markør", "Kontor", 25.90, 110, "IMG/productIMG/marker.jpg", false, 1.1),
                new Product(34, "Saks", "Kontor", 35.90, 120, "IMG/productIMG/scissors.jpg", false, 1.1),
                new Product(35, "Papir", "Kontor", 15.90, 190, "IMG/productIMG/paper.jpg", true, 1.1),
                new Product(36, "Lekebil", "Leker", 80.90, 80, "IMG/productIMG/toycar.jpg", false, 1.1),
                new Product(37, "Kosedyr", "Leker", 120.90, 160, "IMG/productIMG/teddybear.jpg", false, 1.1),
                new Product(38, "Puslespill", "Leker", 60.90, 150, "IMG/productIMG/puzzle.jpg", false, 1.1),
                new Product(39, "Togbane", "Leker", 200.90, 80, "IMG/productIMG/trainset.jpg", false, 1.1),
                new Product(40, "Dukke", "Leker", 100.90, 90, "IMG/productIMG/doll.jpg", false, 1.1),
                new Product(41, "Fotball", "Sport", 150.90, 120, "IMG/productIMG/football.jpg", true, 1.1),
                new Product(42, "Basketball", "Sport", 170.90, 130, "IMG/productIMG/basketball.jpg", false, 1.1),
                new Product(43, "Tennisballer", "Sport", 80.90, 110, "IMG/productIMG/tennisballs.jpg", false, 1.1),
                new Product(44, "Håndvekter", "Sport", 300.90, 70, "IMG/productIMG/dumbbells.jpg", false, 1.1),
                new Product(45, "Joggesko", "Klær", 400.90, 90, "IMG/productIMG/runningshoes.jpeg", false, 1.1),
                new Product(46, "Vase", "Diverse", 100.90, 80, "IMG/productIMG/vase.jpg", false,1.2),
                new Product(47, "Lampe", "Diverse", 200.90, 10, "IMG/productIMG/lamp.jpg",true,1.1),
                new Product(48, "Bilde", "Diverse", 150.90, 20, "IMG/productIMG/painting.jpg",false,1.1),
                new Product(49, "Teppe", "Diverse", 250.90, 5, "IMG/productIMG/rug.jpg",false,1.1),
                new Product(50, "Pynt", "Diverse", 80.90, 30, "IMG/productIMG/decor.jpg",false,1.1)
            ];
        }
    }

    public List<Product> GetProducts()
    {
        return _products;
    }

    public Product GetProductById(int id)
    {
        return _products.FirstOrDefault(p => p.Id == id);
    }

    public void AddProduct(Product newProduct)
    {
        newProduct.SetId(_products.Count);
        _products.Add(newProduct);
        SaveProducts();
    }

    public void UpdateProduct(int id, Product updatedProduct)
    {
        var product = _products.FirstOrDefault(p => p.Id == id);
        if (product != null)
        {
            product.SetStock(updatedProduct.Stock);
            product.SetPriceModifier(updatedProduct.PriceModifier);
            product.SetSale(updatedProduct.IsOnSale);
            SaveProducts();
        }
    }

    public void DeleteProduct(int id)
    {
        var product = _products.FirstOrDefault(p => p.Id == id);
        if (product != null)
        {
            _products.Remove(product);
            SaveProducts();
        }
    }

    private void SaveProducts()
    {
        var updatedJson = JsonSerializer.Serialize(_products);
        File.WriteAllText("products.json", updatedJson);
    }
}