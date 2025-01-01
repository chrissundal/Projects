namespace NettbutikkAPI;

public class Order
{
    public int UserId { get; private set; }
    public int OrderId { get; private set; }
    public int TotalPrice { get; private set; }
    public List<Product> OrderItems { get; private set; }
    public bool IsSent {get; private set;}

    public Order(int userId, int orderId, int totalPrice, List<Product> orderItems, bool isSent)
    {
        UserId = userId;
        OrderId = orderId;
        TotalPrice = totalPrice;
        OrderItems = orderItems;
        IsSent = isSent;
    }
}
