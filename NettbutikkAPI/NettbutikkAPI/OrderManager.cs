using System.Text.Json;

namespace NettbutikkAPI;

public class OrderManager
{
    private readonly List<Order> _orders;
    private readonly ProductManager _productManager;

    public OrderManager(string filePath, ProductManager productManager)
    {
        _productManager = productManager;
        if (File.Exists(filePath))
        {
            var json = File.ReadAllText(filePath);
            _orders = JsonSerializer.Deserialize<List<Order>>(json);
        }
        else
        {
            _orders =
            [
                new Order(1, 0, 106,
                [
                    new Product(1, "Dusjhette", "Clothing", 99, 1, "IMG/productIMG/showercap.jpg"),
                    new Product(8, "Eple", "Food", 7, 1, "IMG/productIMG/eple.jpg")
                ], 0)
            ];
        }
    }

    public List<Order> GetOrders()
    {
        return _orders;
    }

    public void AddOrder(Order newOrder)
    {
        if (!_orders.Contains(newOrder))
        {
            _orders.Add(newOrder);
            SaveOrders();
        }
        else
        {
            Console.WriteLine("Order already exists");
        }
    }

    public void UpdateOrder(Order updatedOrder)
    {
        var orderIndex = _orders.FindIndex(order => order.OrderId == updatedOrder.OrderId);
        if (orderIndex >= 0)
            _orders[orderIndex] = updatedOrder;
        else
            _orders.Add(updatedOrder);
        SaveOrders();
    }

    public void CancelOrder(int orderId)
    {
        var order = _orders.FirstOrDefault(o => o.OrderId == orderId);
        if (order != null)
        {
            foreach (var itemInOrder in order.OrderItems)
            {
                var product = _productManager.GetProductById(itemInOrder.Id);
                if (product != null)
                {
                    product.addStock(itemInOrder.Stock);
                    _productManager.UpdateProduct(product.Id, product);
                }
            }

            SaveOrders();
        }
    }

    private void SaveOrders()
    {
        var updatedJson = JsonSerializer.Serialize(_orders);
        File.WriteAllText("orders.json", updatedJson);
    }

    public void DeleteOrder(int orderId)
    {
        var order = _orders.FirstOrDefault(o => o.OrderId == orderId);
        if (order != null)
        {
            _orders.Remove(order);
            SaveOrders();
        }
    }
}