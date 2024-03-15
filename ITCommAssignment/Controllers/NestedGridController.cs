using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ITCommAssignment.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NestedGridController : ControllerBase
    {
        private readonly List<NestedGridItem> _data;

        public NestedGridController()
        {
            // Initialize dummy data
            _data = GetDummyNestedGridData();
        }

        [HttpGet]
        public IActionResult GetNestedGridData([FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 10, [FromQuery] string? filter = "")
        {
            try
            {
                // Apply filtering
                var filteredData = string.IsNullOrWhiteSpace(filter)
                    ? _data
                    : _data.Where(item => item.Name.Contains(filter, StringComparison.OrdinalIgnoreCase));

                // Calculate total count for pagination
                var totalCount = filteredData.Count();

                // Calculate total pages
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                // Apply pagination
                var paginatedData = filteredData.Skip(pageIndex * pageSize).Take(pageSize).ToList();

                return Ok(new { Data = paginatedData, TotalCount = totalCount, TotalPages = totalPages });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
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
