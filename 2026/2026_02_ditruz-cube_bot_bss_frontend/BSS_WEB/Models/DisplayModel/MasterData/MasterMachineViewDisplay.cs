namespace BSS_WEB.Models.DisplayModel
{
    public class MasterMachineViewDisplay
    {
        public int machineId { get; set; }
        public int departmentId { get; set; }
        public int machineTypeId { get; set; }
        public string machineCode { get; set; }
        public string machineName { get; set; }
        public int? hcLength { get; set; }
        public string? filenameBss { get; set; }
        public bool? isEmergency { get; set; }
        public bool? isActive { get; set; }
        public int? createdBy { get; set; }
        public DateTime createdDate { get; set; } = DateTime.Now;
        public int? updatedBy { get; set; }
        public DateTime? updatedDate { get; set; }
    }
}
