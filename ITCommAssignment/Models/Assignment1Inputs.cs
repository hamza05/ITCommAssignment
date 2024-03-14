namespace ITCommAssignment.Models
{
    public class Assignment1Inputs
    {
        public int Id { get; set; }
        public string ControlType { get; set; }
        public double GridColumns { get; set; }
        public string LabelEnglish { get; set; }
        public string  ValidationExpressionEnglish { get; set; }
        public double MaxSizeEnglish { get; set; }
        public string LabelArabic { get; set; }
        public string ValidationExpressionArabic { get; set; }
        public double MaxSizeArabic { get; set; }
        public int DisplayOrder { get; set; }
        public bool Mandatory { get; set; }

    }
}
