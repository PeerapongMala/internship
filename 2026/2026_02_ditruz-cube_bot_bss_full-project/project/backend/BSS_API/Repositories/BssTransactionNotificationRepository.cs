using Microsoft.EntityFrameworkCore;

namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;

    public class BssTransactionNotificationRepository(ApplicationDbContext db)
        : GenericRepository<BssTransactionNotification>(db),
            IBssTransactionNotificationRepository
    {
        public async Task<BssTransactionNotification?> GetBssTransactionNotificationForValidateAsync(int userId,
            int departmentId, string bssMailRefCode,
            string bssMailOtpCode)
        {
            var dateNow = DateTime.Now;
            return await db.BssTransactionNotification
                .Include(i => i.BssTransactionNotiRecipient)
                .Where(w => w.CreatedBy == userId && w.DepartmentId == departmentId && w.OtpRefCode == bssMailRefCode &&
                            w.OtpCode == bssMailOtpCode && w.OtpDate > dateNow && w.IsSent == true &&
                            w.BssTransactionNotiRecipient.IsRead == false)
                .FirstOrDefaultAsync();
        }
    }
}