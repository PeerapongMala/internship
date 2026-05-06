namespace BSS_WEB.Models.Report
{
    public class HeaderCardListRequest
    {
        public int DepartmentId { get; set; }
        public string RoleGroupCode { get; set; }
        public string MachineId { get; set; }
        public string Date { get; set; }
    }

    public class HeaderCardListResponse
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
    }
}
