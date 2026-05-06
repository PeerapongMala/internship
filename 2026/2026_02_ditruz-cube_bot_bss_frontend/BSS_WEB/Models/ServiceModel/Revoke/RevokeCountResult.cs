namespace BSS_WEB.Models.ServiceModel.Revoke
{
    public class RevokeCountResult
    {
        public int TotalRevoked { get; set; }
        public int TotalPending { get; set; }
        public int TotalWarning { get; set; }
    }
}
