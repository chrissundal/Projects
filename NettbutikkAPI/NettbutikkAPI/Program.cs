using NettbutikkAPI;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.UseHttpsRedirection();
app.UseStaticFiles();

//products

var productManager = new ProductManager("products.json");

app.MapGet("/products", () => productManager.GetProducts());
app.MapPost("/products", (Product newProduct) =>
{
    productManager.AddProduct(newProduct);
    return Results.Ok(newProduct);
});
app.MapPut("/products/{id:int}", (int id, Product updatedProduct) =>
{
    productManager.UpdateProduct(id, updatedProduct);
    return Results.Ok(updatedProduct);
});
app.MapDelete("/products/{id:int}", (int id) =>
{
    productManager.DeleteProduct(id);
    return Results.Ok();
});

//users

var userManager = new UserManager("users.json");

app.MapGet("/users", () => userManager.GetUsers());
app.MapGet("/users/{id:int}", (int id) =>
{
    var user = userManager.GetUserById(id);
    if (user != null) return Results.Ok(user);

    return Results.NotFound("User not found");
});
app.MapGet("/check-username/{username}", (string username) =>
{
    var userExists = userManager.CheckUsernameExists(username);
    return Results.Ok(userExists);
});
app.MapGet("/userslength", () => userManager.GetUserCount());
app.MapPost("/users", (Person newUser) => { userManager.AddUser(newUser); });
app.MapPut("/users/{id:int}", (int id, Person updatedUser) =>
{
    userManager.UpdateUser(id, updatedUser);
    return Results.Ok(updatedUser);
});
app.MapPost("/login", (LoginRequest loginRequest) =>
{
    Console.WriteLine(
        $"Received login attempt with Username: {loginRequest.UserName}, Password: {loginRequest.PassWord}");
    var user = userManager.ValidateLogin(loginRequest.UserName, loginRequest.PassWord);
    if (user != null) return Results.Ok(user);

    return Results.Unauthorized();
});

//orders

var orderManager = new OrderManager("orders.json", productManager);

app.MapDelete("/orders/{orderId:int}", (int orderId) =>
{
    orderManager.DeleteOrder(orderId);
    return Results.Ok();
});
app.MapPut("/orders/{orderId:int}", (int orderId) =>
{
    orderManager.CancelOrder(orderId);
    return Results.Ok();
});
app.MapGet("/orders", () => orderManager.GetOrders());
app.MapPost("/orders", (Order newOrder) =>
{
    orderManager.AddOrder(newOrder);
    return Results.Ok(newOrder);
});
app.MapPut("/orders", (Order updatedOrder) =>
{
    orderManager.UpdateOrder(updatedOrder);
    return Results.Ok(updatedOrder);
});
app.Run();