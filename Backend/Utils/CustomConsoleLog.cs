public static class CustomConsoleLog
{
    public enum Types
    {
        Success,
        Warning,
        Error,
        CriticalError
    }
    public static void Log(Types type, string message)
    {
        switch (type)
        {
            case Types.Success:
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine(message);
                break;
            case Types.Warning:
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine(message);
                break;
            case Types.Error:
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(message);
                break;
            case Types.CriticalError:
                Console.BackgroundColor = ConsoleColor.Red;
                Console.ForegroundColor = ConsoleColor.Black;
                Console.WriteLine(message);
                break;
            default:
                Console.WriteLine(message);
                break;
        }
        Console.ResetColor();
    }
}