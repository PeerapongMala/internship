namespace BSS_API.Models.RequestModels
{
    public class EditSendUnsortDataBarcodeContainerRequest
    {
        public int UserId { get; set; }

        public int DepartmentId { get; set; }

        public ConfirmEditSendUnsortDataResponse SendUnsortData { get; set; }
    }
}