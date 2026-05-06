namespace BSS_API.Models.RequestModels
{
    public class GetNewDeliveryCodeRequest
    {
        public int DepartmentId { get; set; }

        public string? OldDeliveryCode { get; set; }
    }
}