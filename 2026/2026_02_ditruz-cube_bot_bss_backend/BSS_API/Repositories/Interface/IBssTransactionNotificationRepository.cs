namespace BSS_API.Repositories.Interface
{
    using Models.Entities;

    public interface IBssTransactionNotificationRepository : IGenericRepository<BssTransactionNotification>
    {
        Task<BssTransactionNotification?> GetBssTransactionNotificationForValidateAsync(int userId, int departmentId,
            string bssMailRefCode, string bssMailOtpCode);
    }
}