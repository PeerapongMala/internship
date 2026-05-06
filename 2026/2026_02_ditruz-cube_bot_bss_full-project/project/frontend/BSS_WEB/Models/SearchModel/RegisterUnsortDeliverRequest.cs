namespace BSS_WEB.Models.SearchModel
{
    public class RegisterUnsortDeliverRequest
    {
        public bool IsSelectHistory { get; set; } = false;

        public int DepartmentId { get; set; }

        public int CompanyId { get; set; }

        public int CreatedBy { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
