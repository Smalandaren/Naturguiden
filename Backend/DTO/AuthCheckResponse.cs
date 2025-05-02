using System.Text.Json.Serialization;

public class AuthCheckResponse
{
    public bool Authenticated { get; set; }
    public ProfileBasicsDTO? User { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)] // Detta gör så att "IsAdmin" inte returneras alls om värdet är null
    public bool? IsAdmin { get; set; }
}