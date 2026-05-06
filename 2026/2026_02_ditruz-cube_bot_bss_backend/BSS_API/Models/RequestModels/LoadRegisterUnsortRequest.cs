namespace BSS_API.Models.RequestModels
{
    public class LoadRegisterUnsortRequest
    {
        public int DepartmentId { get; set; }
        
        public DateTime StartDate { get; set; }
        
        public DateTime EndDate { get; set; }
    }
}