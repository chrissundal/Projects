namespace NettbutikkSQL;

public class Person
{
    public int Id { get; private set; }
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string UserName { get; private set; }
    public string PassWord { get; private set; }
    public string Address { get; private set; }
    public string City { get; private set; }
    public bool IsEmployee { get; private set; }
    public bool IsAdmin { get; private set; }
    public bool IsBanned { get; private set; }
    public bool IsDeleted { get; private set; }

    public Person(int id, string firstName, string lastName, string userName, string passWord, string address, string city, bool isEmployee, bool isAdmin, bool isBanned, bool isDeleted)
    {
        Id = id;
        FirstName = firstName;
        LastName = lastName;
        UserName = userName;
        PassWord = passWord;
        Address = address;
        City = city;
        IsEmployee = isEmployee;
        IsAdmin = isAdmin;
        IsBanned = isBanned;
        IsDeleted = isDeleted;
    }
    public Person(){}
    
}