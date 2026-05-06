namespace BSS_API.Models
{
    public class reportContainerRequest
    {
        public int RequestByUserId { get; set; } = 0;
        public int DepartmentId { get; set; } = 0;
        public string RoleGroupCode { get; set; }
        public string machineId { get; set; } = "all";
        public required string date { get; set; }
        public required string cashTypeSelect { get; set; }
        public required string shiftTimeSelect { get; set; }

    }
}