namespace BSS_API.Models.ObjectModels
{
    public class UserLoginLogData
    {
        public long LoginLogId { get; set; }
        public int UserId { get; set; }
        public int DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public int? MachineId { get; set; }
        public string? MachineName { get; set; }
        public DateTime? FirstLogin { get; set; }
    }
}
