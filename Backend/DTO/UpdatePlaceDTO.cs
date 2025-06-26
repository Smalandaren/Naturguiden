namespace Backend.DTO
{
    public class UpdatePlaceDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Coordinates { get; set; }
        public List<string> CategoryNames { get; set; }
        public List<string> AttributeNames { get; set; }
        public List<string>? Images { get; set; }

    }
}
