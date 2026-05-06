namespace BSS_API.Models.RequestModels
{
    public class MasterMachineSevenOutputRequest
    {
        public int? MSevenOutputId { get; set; }
        public string MSevenOutputCode { get; set; } = string.Empty;

        public bool? IsActive { get; set; }
    }
}

