using ITCommAssignment.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace ITCommAssignment.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AssignmentController : ControllerBase
    {
        private static List<Assignment1Inputs> userInputsList = new List<Assignment1Inputs>
        {
            // Default values, you can add more if needed
            new Assignment1Inputs
            {
                Id = 1,
                ControlType = "Type 1",
                GridColumns = 2,
                LabelEnglish = "Label 1",
                ValidationExpressionEnglish = "Expression 1",
                MaxSizeEnglish = 10,
                LabelArabic = "التسمية 1",
                ValidationExpressionArabic = "اختبار التعبير 1",
                MaxSizeArabic = 15,
                DisplayOrder = 1,
                Mandatory = true
            },
            new Assignment1Inputs
            {
                Id=2,
                ControlType = "Type 2",
                GridColumns = 3,
                LabelEnglish = "Label 2",
                ValidationExpressionEnglish = "Expression 2",
                MaxSizeEnglish = 20,
                LabelArabic = "التسمية 2",
                ValidationExpressionArabic = "اختبار التعبير 2",
                MaxSizeArabic = 25,
                DisplayOrder = 2,
                Mandatory = false
            }
        };

        private readonly ILogger<AssignmentController> _logger;

        public AssignmentController(ILogger<AssignmentController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Assignment1Inputs> Get()
        {
            return userInputsList;
        }

        [HttpPost]
        public IEnumerable<Assignment1Inputs> Post(Assignment1Inputs inputs)
        {
            int newId = userInputsList.Max(x => x.Id) + 1;
            inputs.Id = newId;
            // Add the new input to the list
            userInputsList.Add(inputs);

            // Return the updated list
            return userInputsList;
        }
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Assignment1Inputs updatedInputs)
        {
            var existingInput = userInputsList.FirstOrDefault(x => x.Id == id);
            if (existingInput == null)
            {
                return NotFound();
            }

            // Update existing input
            existingInput.ControlType = updatedInputs.ControlType;
            existingInput.GridColumns = updatedInputs.GridColumns;
            existingInput.LabelEnglish = updatedInputs.LabelEnglish;
            existingInput.ValidationExpressionEnglish = updatedInputs.ValidationExpressionEnglish;
            existingInput.MaxSizeEnglish = updatedInputs.MaxSizeEnglish;
            existingInput.LabelArabic = updatedInputs.LabelArabic;
            existingInput.ValidationExpressionArabic = updatedInputs.ValidationExpressionArabic;
            existingInput.MaxSizeArabic = updatedInputs.MaxSizeArabic;
            existingInput.DisplayOrder = updatedInputs.DisplayOrder;
            existingInput.Mandatory = updatedInputs.Mandatory;
            
            return Ok(existingInput);
        }


    }
}
