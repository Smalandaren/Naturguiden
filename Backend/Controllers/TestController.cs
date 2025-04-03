using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        // GET: <TestController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return GreetingService.GetGreetings();
        }

        // GET <TestController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return GreetingService.GetGreeting(id);
        }

        // POST <TestController>
        [HttpPost]
        public void Post([FromBody] string name)
        {
            GreetingService.AddGreeting(name);
        }

        // PUT <TestController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string name)
        {
            GreetingService.EditGreeting(id, name);
        }

        // DELETE <TestController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            GreetingService.RemoveGreeting(id);
        }
    }
}
