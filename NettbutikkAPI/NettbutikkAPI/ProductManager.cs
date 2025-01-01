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
                new Product(0, "Hat", "Klær", 49, 10, "IMG/productIMG/hatt.jpg"),
                new Product(1, "Dusjhette", "Klær", 99, 10, "IMG/productIMG/showercap.jpg"),
                new Product(2, "Blyant", "Kontor", 15, 10, "IMG/productIMG/blyant.jpg"),
                new Product(3, "Gaffatape", "Kontor", 35, 10, "IMG/productIMG/tape.jpg"),
                new Product(4, "Dinosaur", "Leker", 149, 10, "IMG/productIMG/dinosaur.jpg"),
                new Product(5, "Banan", "Mat", 8, 100, "IMG/productIMG/banan.jpg"),
                new Product(6, "Dopapir", "Mat", 49, 10, "IMG/productIMG/dopapir.jpg"),
                new Product(7, "Redbull", "Drikke", 35, 10, "IMG/productIMG/energi.jpg"),
                new Product(8, "Eple", "Mat", 7, 10, "IMG/productIMG/eple.jpg"),
                new Product(9, "Melk", "Drikke", 22, 10, "IMG/productIMG/melk.jpg"),
                new Product(10, "Sjokolade", "Mat", 35, 10, "IMG/productIMG/sjokolade.jpg"),
                new Product(11, "Brød", "Mat", 30, 50, "IMG/productIMG/bread.jpg"),
                new Product(12, "Ost", "Mat", 60, 40, "IMG/productIMG/cheese.jpg"),
                new Product(13, "Salami", "Mat", 80, 25, "IMG/productIMG/salami.jpg"),
                new Product(14, "Smør", "Mat", 40, 30, "IMG/productIMG/butter.jpg"),
                new Product(15, "Sukker", "Mat", 50, 35, "IMG/productIMG/sugar.jpg"),
                new Product(16, "Salt", "Mat", 10, 60, "IMG/productIMG/salt.jpg"),
                new Product(17, "Pepper", "Mat", 20, 45, "IMG/productIMG/pepper.jpg"),
                new Product(18, "Ketchup", "Mat", 25, 55, "IMG/productIMG/ketchup.jpg"),
                new Product(19, "Majones", "Mat", 28, 40, "IMG/productIMG/mayo.jpg"),
                new Product(20, "Potetgull", "Mat", 35, 70, "IMG/productIMG/chips.jpg"),
                new Product(21, "Soda", "Drikke", 25, 20, "IMG/productIMG/soda.jpg"),
                new Product(22, "Juice", "Drikke", 30, 25, "IMG/productIMG/juice.jpg"),
                new Product(23, "Kaffe", "Drikke", 40, 30, "IMG/productIMG/coffee.jpg"),
                new Product(24, "Te", "Drikke", 20, 35, "IMG/productIMG/tea.jpg"),
                new Product(25, "Vann", "Drikke", 15, 40, "IMG/productIMG/water.jpg"),
                new Product(26, "T-skjorte", "Klær", 99, 15, "IMG/productIMG/tshirt.jpg"),
                new Product(27, "Bukse", "Klær", 150, 10, "IMG/productIMG/pants.jpg"),
                new Product(28, "Genser", "Klær", 200, 8, "IMG/productIMG/sweater.jpg"),
                new Product(29, "Skjørt", "Klær", 120, 12, "IMG/productIMG/skirt.jpg"),
                new Product(30, "Jakke", "Klær", 250, 7, "IMG/productIMG/jacket.jpg"),
                new Product(31, "Notatbok", "Kontor", 40, 30, "IMG/productIMG/notebook.jpg"),
                new Product(32, "Stiftemaskin", "Kontor", 45, 20, "IMG/productIMG/stapler.jpg"),
                new Product(33, "Markør", "Kontor", 25, 50, "IMG/productIMG/marker.jpg"),
                new Product(34, "Saks", "Kontor", 35, 25, "IMG/productIMG/scissors.jpg"),
                new Product(35, "Papir", "Kontor", 15, 100, "IMG/productIMG/paper.jpg"),
                new Product(36, "Lekebil", "Leker", 80, 15, "IMG/productIMG/toycar.jpg"),
                new Product(37, "Kosedyr", "Leker", 120, 20, "IMG/productIMG/teddybear.jpg"),
                new Product(38, "Puslespill", "Leker", 60, 25, "IMG/productIMG/puzzle.jpg"),
                new Product(39, "Togbane", "Leker", 200, 5, "IMG/productIMG/trainset.jpg"),
                new Product(40, "Dukke", "Leker", 100, 18, "IMG/productIMG/doll.jpg"),
                new Product(41, "Fotball", "Sport", 150, 12, "IMG/productIMG/football.jpg"),
                new Product(42, "Basketball", "Sport", 170, 10, "IMG/productIMG/basketball.jpg"),
                new Product(43, "Tennisballer", "Sport", 80, 20, "IMG/productIMG/tennisballs.jpg"),
                new Product(44, "Håndvekter", "Sport", 300, 8, "IMG/productIMG/dumbbells.jpg"),
                new Product(45, "Joggesko", "Sport", 400, 6, "IMG/productIMG/runningshoes.jpeg"),
                new Product(46, "Vase", "Diverse", 100, 15, "IMG/productIMG/vase.jpg"),
                new Product(47, "Lampe", "Diverse", 200, 10, "IMG/productIMG/lamp.jpg"),
                new Product(48, "Bilde", "Diverse", 150, 20, "IMG/productIMG/painting.jpg"),
                new Product(49, "Teppe", "Diverse", 250, 5, "IMG/productIMG/rug.jpg"),
                new Product(50, "Pynt", "Diverse", 80, 30, "IMG/productIMG/decor.jpg")
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