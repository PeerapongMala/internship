namespace BSS_WEB.Models.ServiceModel
{
    public class EditSendUnsortDataBarcodeContainerRequest
    {
        public int UserId { get; set; }

        public int DepartmentId { get; set; }

        public ConfirmEditSendUnsortDataResponse SendUnsortData { get; set; }
    }
}
