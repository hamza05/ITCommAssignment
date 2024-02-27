using Microsoft.AspNetCore.Mvc;

namespace ITCommAssignment.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NestedGridController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetNestedGridData()
        {
            var nestedGridData = GetDummyNestedGridData();
            return Ok(nestedGridData);
        }

        private List<NestedGridItem> GetDummyNestedGridData()
        {
            var data = new List<NestedGridItem>();

            for (int i = 1; i <= 30; i++)
            {
                var parent = new NestedGridItem
                {
                    Id = i,
                    Name = $"Parent {i}",
                    Value = 100 * i,
                    Children = new List<NestedGridItem>()
                };

                for (int j = 1; j <= 5; j++)
                {
                    parent.Children.Add(new NestedGridItem
                    {
                        Id = i * 10 + j,
                        Name = $"Child {i}-{j}",
                        Value = 50 * j,
                    });
                }

                data.Add(parent);
            }

            return data;
        }
    }

    public class NestedGridItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Value { get; set; }
        public List<NestedGridItem> Children { get; set; }
    }
}
