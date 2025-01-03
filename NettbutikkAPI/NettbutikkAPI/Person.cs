namespace NettbutikkAPI;

public class Person
{
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string UserName { get; private set; }
    public string PassWord { get; private set; }
    public string Address { get; private set; }
    public string City { get; private set; }
    public int Id { get; private set; }
    public List<Product> MyCart { get; }
    public bool IsEmployee { get; private set; }
    public bool IsAdmin { get; private set; }
    public bool IsBanned { get; private set; }
    
    public Person(string firstName, string lastName, string userName, string passWord, string address, string city, int id, List<Product> myCart, bool isEmployee, bool isAdmin, bool isBanned)
    {
        FirstName = firstName;
        LastName = lastName;
        UserName = userName;
        PassWord = passWord;
        Address = address;
        City = city;
        Id = id;
        MyCart = myCart;
        IsEmployee = isEmployee;
        IsAdmin = isAdmin;
        IsBanned = isBanned;
    }
}