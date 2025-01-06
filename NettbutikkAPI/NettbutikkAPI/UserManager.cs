using System.Text.Json;

namespace NettbutikkAPI;

public class UserManager
{
    private readonly List<Person> _users;

    public UserManager(string filePath)
    {
        if (File.Exists(filePath))
        {
            var json = File.ReadAllText(filePath);
            _users = JsonSerializer.Deserialize<List<Person>>(json);
        }
        else
        {
            _users =
            [
                new Person("Chris", "Jacobsen", "c", "1", "Svingen 2", "Larvik", 0, new List<Product>(), true, true,false,false),
                new Person("Bjarne", "Hansen", "b", "1", "Torget 7", "Sandefjord", 1, new List<Product>(), false, false,false,false)
            ];
        }
    }

    public List<Person> GetUsers()
    {
        return _users;
    }

    public Person GetUserById(int id)
    {
        return _users.FirstOrDefault(u => u.Id == id);
    }

    public bool CheckUsernameExists(string username)
    {
        return _users.Any(u => u.UserName == username);
    }

    public int GetUserCount()
    {
        return _users.Count;
    }

    public void AddUser(Person newUser)
    {
        _users.Add(newUser);
        SaveUsers();
    }

    public void UpdateUser(int id, Person updatedUser)
    {
        var userIndex = _users.FindIndex(u => u.Id == id);
        if (userIndex >= 0)
        {
            _users[userIndex] = updatedUser;
            SaveUsers();
        }
    }

    public Person ValidateLogin(string username, string password)
    {
        return _users.FirstOrDefault(u => u.UserName == username && u.PassWord == password);
    }

    private void SaveUsers()
    {
        var updatedJson = JsonSerializer.Serialize(_users);
        File.WriteAllText("users.json", updatedJson);
    }
}