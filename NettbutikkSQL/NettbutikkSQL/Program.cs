 using NettbutikkSQL;
 using Dapper;
 using Microsoft.AspNetCore.Mvc;
 using Microsoft.Data.SqlClient;

 var builder = WebApplication.CreateBuilder(args);
 var app = builder.Build();
 app.UseHttpsRedirection();
 app.UseStaticFiles();
 string connStr = "Data Source=(localdb)\\local;Initial Catalog=Prishimmelen;Integrated Security=True";
 
 //get
 app.MapGet("/products", async () =>
 {
         var sql = "SELECT * FROM Products";
         var conn = new SqlConnection(connStr);
         var products = await conn.QueryAsync<Product>(sql);
         return products;
 });
 
 app.MapGet("/orders", async () =>
 {
        var sql = "SELECT * FROM Orders";
        var sqlOrderItems = "SELECT * FROM OrderItems";
        var conn = new SqlConnection(connStr);
        var ordersList = new List<Order>();
        var orderItemsList = await conn.QueryAsync<OrderItem>(sqlOrderItems);
        var results = await conn.QueryAsync<dynamic>(sql);
         foreach (var result in results)
         {
             var ordersItems = new List<OrderItem>();
             foreach (var orderItem in orderItemsList)
             {
                 if (orderItem.OrderId == result.OrderId)
                 {
                     ordersItems.Add(orderItem);
                 }
             }
             var newOrder = new Order(result.UserId, result.OrderId, result.TotalPrice,ordersItems, result.Status);
             ordersList.Add(newOrder);
         }
         return Results.Ok(ordersList);
 });
 app.MapGet("/users/{id:int}", async (int id) =>
 {
     var conn = new SqlConnection(connStr);
         var sql = "SELECT * FROM Users WHERE Id = @Id";
         var user = await conn.QuerySingleOrDefaultAsync<Person>(sql, new { Id = id });
         if (user != null)
         {
             return Results.Ok(user);
         }
         else
         {
             return Results.NotFound("User not found");
         }
 });
 app.MapGet("/users/{id:int}/cart", async (int id) =>
 {
     var sql = "SELECT prod.*, cart.Quantity FROM Cart cart JOIN Products prod ON cart.ProductId = prod.Id WHERE cart.UserId = @UserId";
     var conn = new SqlConnection(connStr);
         var cartItems = new List<Product>();
         var results = await conn.QueryAsync<dynamic>(sql, new { UserId = id });
         foreach (var result in results)
         {
             var product = new Product(result.Id, result.NameOfProduct, result.TypeOfProduct, result.Price,
                 result.Quantity, result.ImageUrl, result.IsOnSale, result.PriceModifier);
             cartItems.Add(product);
         }
         return Results.Ok(cartItems);
 });
//put

 app.MapPut("/cart", async (CartItem cartItem) =>
 {
     var sql = @"
        IF EXISTS (SELECT 1 FROM Cart WHERE UserId = @UserId AND ProductId = @ProductId)
        BEGIN
            UPDATE Cart SET Quantity = @Quantity WHERE UserId = @UserId AND ProductId = @ProductId
        END
        ELSE
        BEGIN
            INSERT INTO Cart VALUES (@UserId, @ProductId, @Quantity)
        END";

     var conn = new SqlConnection(connStr);
     await conn.ExecuteAsync(sql, cartItem);
     return Results.Ok("Cart item updated successfully.");
     
 });
 app.MapPut("/products/{id:int}", async (Product updatedProduct) =>
     {
        string sql = "UPDATE Products SET Stock = @Stock, PriceModifier = @PriceModifier, IsOnSale = @IsOnSale WHERE Id = @Id"; 
        var conn = new SqlConnection(connStr);
        var rowsAffected = await conn.ExecuteAsync(sql, updatedProduct);
        return rowsAffected;
     });
 app.MapPut("/orders", async (Order updatedOrder) =>
     {
        string sql = "UPDATE Orders SET Status = @Status WHERE OrderId = @OrderId"; 
        var conn = new SqlConnection(connStr);
        var rowsAffected = await conn.ExecuteAsync(sql, updatedOrder);
        return rowsAffected;
     });
 
 //post
 app.MapPost("/orders", async (Order order) =>
{
        var orderSql = @"
        INSERT INTO Orders VALUES (@UserId, @TotalPrice, @Status);
        SELECT SCOPE_IDENTITY();";

        var orderItemSql = "INSERT INTO OrderItems VALUES (@OrderId, @ProductId, @ProductName, @Quantity, @Price);";
        var conn = new SqlConnection(connStr);
        var orderId = await conn.ExecuteScalarAsync<int>(orderSql, new 
        {
            UserId = order.UserId,
            TotalPrice = order.TotalPrice,
            Status = order.Status
        });
        foreach (var item in order.OrderItems)
        {
            await conn.ExecuteAsync(orderItemSql, new 
            {
                OrderId = orderId,
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                Quantity = item.Quantity,
                Price = item.Price
            });
        }
        return Results.Ok("Order placed successfully.");
});
 
 app.MapPost("/login", async (LoginRequest login) =>
 {
     Console.WriteLine($"Prøvd å logge inn bruker: {login.UserName} med passord: {login.PassWord}");
     var sql = "SELECT * FROM Users WHERE UserName = @UserName AND PassWord = @Password";
     var conn = new SqlConnection(connStr);
     var result = await conn.QuerySingleOrDefaultAsync<Person>(sql, new { UserName = login.UserName, PassWord = login.PassWord });
     if (result != null)
     {
         return Results.Ok(result);
     }
     else
     {
         return Results.NotFound("User not found");
     }
 });

//delete
 app.MapDelete("/cart", async ([FromBody] CartItem cartItem) =>
 {
     var sql = "DELETE FROM Cart WHERE UserId = @UserId AND ProductId = @ProductId";
     var conn = new SqlConnection(connStr);
     var rowsAffected = await conn.ExecuteAsync(sql, cartItem);
     if (rowsAffected > 0)
     {
         return Results.Ok($"{cartItem.ProductId} ble slettet");
     }
     else
     {
         return Results.NotFound("Cart item not found.");
     }
 });


app.Run();
