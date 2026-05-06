namespace BSS_API.Models.External.Response
{
    using Entities;

    public class ConvertToReceiveCbmsDataTransactionResponse
    {
        public string? BnTypeInput { get; set; }

        public int DepartmentId { get; set; }

        public List<ReceiveCbmsDataTransaction> ReceiveCbmsDataTransactionNew = new();

        public List<ReceiveCbmsDataTransactionDuplicate> ReceiveCbmsDataTransactionDuplicate = new();
    }

    public class ReceiveCbmsDataTransactionDuplicate
    {
        public ReceiveCbmsDataTransaction OldReceiveCbms { get; set; } = new();

        public ReceiveCbmsDataTransaction NewReceiveCbms { get; set; } = new();
    }
}