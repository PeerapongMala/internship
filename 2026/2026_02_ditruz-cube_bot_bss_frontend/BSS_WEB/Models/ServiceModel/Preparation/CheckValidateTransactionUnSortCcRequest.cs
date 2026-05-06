namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class CheckValidateTransactionUnSortCcRequest
    {
        public int DepartmentId { get; set; } = 0;
        public string ContainerId { get; set; }
        public DateTime StartDate { get; set; } = DateTime.Now;
        public DateTime EndDate { get; set; } = DateTime.Now;
        public int CompanyId { get; set; } = 0;
    }
}
