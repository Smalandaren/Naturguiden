namespace Backend.Services;
using Backend.Models;

public class GreetingService
{
    public static List<Greeting> greetings = new List<Greeting>
    {
        new Greeting(0, "Hello World")
    };

    public static List<string> GetGreetings()
    {
        List<string> greetingNames = new List<string>();
        foreach (Greeting greeting in greetings)
        {
            greetingNames.Add(greeting.Name);
        }
        return greetingNames;
    }

    public static string GetGreeting(int id)
    {
        if (id < greetings.Count && id >= 0)
        {
            return greetings[id].Name;
        }
        else
        {
            return "Invalid ID";
        }
    }

    public static void AddGreeting(string name)
    {
        if (name is not null)
        {
            greetings.Add(new Greeting(greetings.Count, name));
        }
    }

    public static void EditGreeting(int id, string name)
    {
        if (id < greetings.Count && id >= 0 && name is not null)
        {
            greetings[id].Name = name;
        }
        else
        {
            return;
        }

    }

    public static void RemoveGreeting(int id)
    {
        if (id < greetings.Count && id >= 0)
        {
            greetings.RemoveAt(id);
        }
    }
}
