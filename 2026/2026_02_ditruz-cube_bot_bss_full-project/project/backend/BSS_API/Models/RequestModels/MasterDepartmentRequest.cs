namespace BSS_API.Models.RequestModels
{
    public class MasterDepartmentRequest
    {         
        public int? DepartmentId { get; set; }
        public string DepartmentCode { get; set; }=string.Empty;
        public bool? IsActive { get; set; }
    }
}
