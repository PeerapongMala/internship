namespace BSS_WEB.Models.SearchModel
{
    public class GetNewDeliveryCodeRequest
    {
        public int DepartmentId { get; set; }

        public string? OldDeliveryCode { get; set; }
    }
}
