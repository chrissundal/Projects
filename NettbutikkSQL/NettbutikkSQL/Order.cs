namespace NettbutikkSQL;

public class Order
{
    public int UserId { get; private set; }
    public int OrderId { get; private set; }
    public double TotalPrice { get; private set; }
    public List<OrderItem> OrderItems { get; private set; }
    public int Status { get; private set; }
    
    public Order(int userId, int orderId, double totalPrice, List<OrderItem> orderItems, int status)
    {
        UserId = userId;
        OrderId = orderId;
        TotalPrice = totalPrice;
        OrderItems = orderItems;
        Status = status;
    }

   
}