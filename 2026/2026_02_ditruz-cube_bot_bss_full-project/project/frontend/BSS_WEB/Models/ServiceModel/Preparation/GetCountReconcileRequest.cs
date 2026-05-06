namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class GetCountReconcileRequest
    {
        public int departmentId { get; set; } = 0;

        public string prepareCentral { get; set; } = string.Empty;

        public string bnTypeCode { get; set; } = string.Empty;

        public DateTime? dateTimeStart { get; set; } 

        public DateTime? dateTimeEnd { get; set; }

        public int machineId { get; set; } = 0;
    }
}
