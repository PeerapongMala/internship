namespace BSS_API.Models.RequestModels
{
    public class MachineFilterRequest
    {
        public string DepartmentFilter { get; set; } = string.Empty;
        public string MachineTypeFilter { get; set; } = string.Empty;
        public string StatusFilter { get; set; } = string.Empty;
    }
}
