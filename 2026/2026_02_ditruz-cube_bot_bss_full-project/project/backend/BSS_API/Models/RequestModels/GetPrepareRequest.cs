namespace BSS_API.Models.RequestModels
{
    public class GetPrepareRequest
    {
        public int DepartmentId { get; set; }
        public int? MachineId { get; set; }
        public string? BnTypeCode { get; set; }
    }
}
