public class AuthCheckResponse
{
    public bool Authenticated { get; set; }
    public ProfileBasicsDTO? User { get; set; }
}