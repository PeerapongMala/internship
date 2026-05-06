namespace BSS_WEB.Models.ObjectModel
{
    public class UserLoginLogData
    {
        public long loginLogId { get; set; }
        public int userId { get; set; }
        public int departmentId { get; set; }
        public string? departmentName { get; set; }
        public int? machineId { get; set; }
        public string? machineName { get; set; }
        public DateTime? firstLogin { get; set; }
    }
}
