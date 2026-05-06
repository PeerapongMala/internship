using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;

namespace BSS_API.Services.Interface
{
    public interface ITransactionUserLoginLogService
    {
        Task<IEnumerable<TransactionUserLoginLog>> GetAllTransactionUserLoginLogs();
        Task CreateTransactionUserLoginLog(TransactionUserLoginLog entity);
        Task UpdateTransactionUserLoginLog(TransactionUserLoginLog entity);
        Task<TransactionUserLoginLog> GetTransactionUserLoginLogById(int Id);
        Task DeleteTransactionUserLoginLog(int Id);
        Task<TransactionUserLoginLog> GetTransactionLoginLogByUserId(int userId);
        Task<IEnumerable<TransactionUserLoginLog>> GetTransactionUserLoginLogsByDepartmentId(int departmentId);
        Task<IEnumerable<UserLoginLogData>> GetLoginLogActiveByUserIdAsync(int userId, int departmentId);
    }
}
