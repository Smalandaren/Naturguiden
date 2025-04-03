namespace Backend.Models
{
    public class Greeting
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public Greeting(int Id, string Name) 
        {
            this.Id = Id;
            this.Name = Name;
        }
    }
}
