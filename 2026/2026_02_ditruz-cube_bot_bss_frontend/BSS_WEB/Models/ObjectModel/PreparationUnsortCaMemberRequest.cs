namespace BSS_WEB.Models.ObjectModel
{
    public class PreparationUnsortCaMemberRequest
    {
        public int DepartmentId { get; set; }
        public int? MachineId { get; set; }
        public bool IsReconcile { get; set; }
        public bool IsActive { get; set; }
        public int StatusId { get; set; }
        public int BnTypeId { get; set; }
    }
}
