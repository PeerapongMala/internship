namespace BSS_API.Models.RequestModels
{
    public class MasterMachineTypeRequest
    {
        public int? MachineTypeId { get; set; }

        public string MachineTypeCode { get; set; } = string.Empty;

        public bool? IsActive { get; set; }
    }
}

