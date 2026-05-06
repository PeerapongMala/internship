namespace BSS_API.Models.ResponseModels;

public class RefreshResponse
{
    public int TotalFilesFound { get; set; }
    public int TotalFilesImported { get; set; }
    public int TotalFilesSkipped { get; set; }
    public int TotalFilesError { get; set; }
    public int TotalMatched { get; set; }
    public List<MachineHdImportResponse> ImportedHeaders { get; set; } = [];
    public List<FileErrorResponse> Errors { get; set; } = [];
}

public class MachineHdImportResponse
{
    public long MachineHdId { get; set; }
    public string HeaderCardCode { get; set; } = string.Empty;
    public string? DepositId { get; set; }
    public int? MachineQty { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string? IsReject { get; set; }
}

public class FileErrorResponse
{
    public string FileName { get; set; } = string.Empty;
    public string ErrorMessage { get; set; } = string.Empty;
}
