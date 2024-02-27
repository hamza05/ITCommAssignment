using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml; // Install the EPPlus NuGet package for Excel processing

namespace ITCommAssignment.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ExcelImportController : ControllerBase
    {

        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Looks Good");
        }

        [HttpPost]
        public IActionResult Post([FromForm] IFormFile file)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            if (file == null || file.Length == 0)
            {
                return BadRequest("Invalid file");
            }

            try
            {
                using (var package = new ExcelPackage(file.OpenReadStream()))
                {
                    var worksheet = package.Workbook.Worksheets[0]; // Assuming data is in the first worksheet

                    // Get headers dynamically
                    var headers = new List<string>();
                    for (int col = 1; col <= worksheet.Dimension.Columns; col++)
                    {
                        headers.Add(worksheet.Cells[1, col].Value?.ToString() ?? string.Empty);
                    }

                    // Process the Excel data as needed
                    // You can use a library like exceljs to manipulate the data

                    // Example: Convert the data to a list of lists (headers + rows)
                    var excelData = ProcessExcelData(worksheet);

                    return Ok(excelData);
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Error processing Excel file: {ex.Message}");
            }
        }

        private List<List<string>> ProcessExcelData(ExcelWorksheet worksheet)
        {
            var excelData = new List<List<string>>();

            // Add headers
            var headers = new List<string>();
            for (int col = 1; col <= worksheet.Dimension.Columns; col++)
            {
                headers.Add(worksheet.Cells[1, col].Value?.ToString() ?? string.Empty);
            }
            excelData.Add(headers);

            // Add rows
            for (int row = 2; row <= worksheet.Dimension.Rows; row++)
            {
                var rowData = new List<string>();
                for (int col = 1; col <= worksheet.Dimension.Columns; col++)
                {
                    rowData.Add(worksheet.Cells[row, col].Value?.ToString() ?? string.Empty);
                }
                excelData.Add(rowData);
            }

            return excelData;
        }
    }
}
