namespace BSS_API.Models.Report.RegisterUnsort
{
    public class SendUnsortDeliveryRequest
    {
        public long PrintId { get; set; }

        public bool IsHistory { get; set; }

        public int MachineId { get; set; }

        public int DepartmentId { get; set; }
    }
}