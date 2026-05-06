namespace BSS_WEB.Models.ServiceModel.Reconcile
{
    public class RefreshResult
    {
        public int TotalFilesFound { get; set; }
        public int TotalFilesImported { get; set; }
        public int TotalFilesSkipped { get; set; }
        public int TotalFilesError { get; set; }
        public List<MachineHdImportResult> ImportedHeaders { get; set; } = [];
        public List<FileErrorResult> Errors { get; set; } = [];
    }

    public class MachineHdImportResult
    {
        public long MachineHdId { get; set; }
        public string HeaderCardCode { get; set; } = string.Empty;
        public string? DepositId { get; set; }
        public int? MachineQty { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string? IsReject { get; set; }
    }

    public class FileErrorResult
    {
        public string FileName { get; set; } = string.Empty;
        public string ErrorMessage { get; set; } = string.Empty;
    }
}
