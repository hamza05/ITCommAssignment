using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using OfficeOpenXml; // Install the EPPlus NuGet package for Excel processing

namespace ITCommAssignment.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ExcelImportController : ControllerBase
    {
        private readonly string _connectionString;

        public ExcelImportController()
        {
            // Set up the connection string using the provided information
            _connectionString = "Server=sql10.freesqldatabase.com;Port=3306;Database=sql10691514;Uid=sql10691514;Pwd=8uIhrDPbNz;";
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

                    // Process the Excel data and insert into the database
                    CreateExcelTableInsertData(worksheet, headers, file.FileName);
                    var excelData = ProcessExcelFileData(worksheet);

                    return Ok(excelData);
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Error processing Excel file: {ex.Message}");
            }
        }

        private void CreateExcelTableInsertData(ExcelWorksheet worksheet, List<string> headers, string fileName)
        {
            // Remove spaces from the file name
            string tableName = fileName.Replace(" ", "").Replace(".xlsx","").Replace(".xls","");

            using (var connection = new MySqlConnection(_connectionString))
            {
                connection.Open();

                // Prepare SQL command to create table
                string createTableCommand = $"CREATE TABLE {tableName} (";
                // Prepare SQL command to insert data into table
                string insertDataCommand = $"INSERT INTO {tableName} ({string.Join(", ", headers.Select(x => x.Replace(" ", "")))}) VALUES ";

                // Iterate over headers to create table schema
                foreach (var header in headers)
                {
                    createTableCommand += $"{header.Replace(" ", "")} VARCHAR(255), "; // Remove spaces from column names
                }
                createTableCommand = createTableCommand.TrimEnd(',', ' ') + ")"; // Remove trailing comma

                // Execute create table command
                using (var command = new MySqlCommand(createTableCommand, connection))
                {
                    command.ExecuteNonQuery();
                }

                // Iterate over each row in the Excel worksheet and insert into database
                for (int row = 2; row <= worksheet.Dimension.Rows; row++)
                {
                    List<string> rowData = new List<string>();

                    for (int col = 1; col <= worksheet.Dimension.Columns; col++)
                    {
                        // Check if the cell contains a formula
                        var cell = worksheet.Cells[row, col];
                        if (cell.Formula != null && cell.Formula.Length > 1)
                        {
                            // If the cell contains a formula, add a calculated column to the SQL command
                            string formula = cell.Formula;
                            // Replace cell references with actual values
                            foreach (var header in headers)
                            {
                                formula = formula.Replace(header, $"({worksheet.Cells[row, headers.IndexOf(header) + 1].Value})");
                            }
                            rowData.Add($"({formula})");
                        }
                        else
                        {
                            // If the cell does not contain a formula, add the cell value
                            rowData.Add($"'{cell.Value?.ToString()}'");
                        }
                    }

                    // Append the row data to the SQL command
                    insertDataCommand += $"({string.Join(", ", rowData)}), ";
                }

                // Remove the trailing comma and execute the SQL command
                insertDataCommand = insertDataCommand.TrimEnd(',', ' ');
                using (var command = new MySqlCommand(insertDataCommand, connection))
                {
                    command.ExecuteNonQuery();
                }
            }
        }
        private List<List<string>> ProcessExcelFileData(ExcelWorksheet worksheet)
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
    

