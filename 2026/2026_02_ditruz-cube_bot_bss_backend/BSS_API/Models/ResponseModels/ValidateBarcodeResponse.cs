namespace BSS_API.Models.ResponseModels
{
    public class ValidateBarcodeResponse
    {
        public bool IsValid { get; set; } = false;

        public string? ErrorMessage { get; set; }

        public string? MachineConflictMessage { get; set; }

        public List<PreparationAllTypeResponse> Data { get; set; } = new();
    }
}