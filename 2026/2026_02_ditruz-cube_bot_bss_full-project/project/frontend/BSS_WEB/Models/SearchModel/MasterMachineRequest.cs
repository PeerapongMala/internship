namespace BSS_API.Models.RequestModels
{
    public class MasterMachineRequest
    {
        public int? MachineId { get; set; }
        public int? DepartmentId { get; set; }
        public int? MachineTypeId { get; set; }

        public string MachineCode { get; set; } = string.Empty;

        public bool? IsActive { get; set; }
        public bool? IsEmergency { get; set; }
    }
}

