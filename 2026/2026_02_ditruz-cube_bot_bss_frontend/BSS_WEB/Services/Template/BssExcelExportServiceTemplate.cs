namespace BSS_WEB.Services.Template
{
    using ClosedXML.Excel;

    public abstract class BssExcelExportServiceTemplate
    {
        protected XLWorkbook? _xlWorkbook = null;

        private string _excelFolderName = "Excels";

        private string templateFilePath = string.Empty;
       
        public BssExcelExportServiceTemplate()
        {
           
        }

        public BssExcelExportServiceTemplate(string reportFileName, string excelFolderName = "Excels")
        {
            if (string.IsNullOrEmpty(reportFileName))
            {
                throw new ArgumentNullException(nameof(reportFileName));
            }

            if (!reportFileName.EndsWith(".xlsx", StringComparison.OrdinalIgnoreCase))
            {
                reportFileName += ".xlsx";
            }

            if (!string.IsNullOrEmpty(excelFolderName))
            {
                _excelFolderName = excelFolderName;
            }

            this.templateFilePath = Path.Combine(
                Directory.GetCurrentDirectory(),
                excelFolderName,
                reportFileName
            );

            if (!File.Exists(templateFilePath)) 
            {
                throw new FileNotFoundException("Template file not found", templateFilePath);
            }

            InitialXLWorkbook();
        }

        private void InitialXLWorkbook()
        {
            try
            {
                if (!string.IsNullOrEmpty(templateFilePath))
                {
                    _xlWorkbook = new XLWorkbook(templateFilePath);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
