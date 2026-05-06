using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;

namespace BSS_API.Services
{
    public class TransactionUserLoginLogService : ITransactionUserLoginLogService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TransactionUserLoginLogService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateTransactionUserLoginLog(TransactionUserLoginLog entity)
        {
            await _unitOfWork.TransUserLoginLogRepos.AddAsync(entity);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteTransactionUserLoginLog(int Id)
        {
            var rowData = await _unitOfWork.TransUserLoginLogRepos.GetAsync(item => item.LoginLogId == Id);

            if (rowData != null)
            {
                rowData.IsActive = false;
                _unitOfWork.TransUserLoginLogRepos.Update(rowData);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<IEnumerable<TransactionUserLoginLog>> GetAllTransactionUserLoginLogs()
        {
            return await _unitOfWork.TransUserLoginLogRepos.GetAllAsync();
        }
        public async Task<IEnumerable<TransactionUserLoginLog>> GetTransactionUserLoginLogsByDepartmentId(int departmentId)
        {
            var result = new List<TransactionUserLoginLog>();
            var logUsers = await _unitOfWork.TransUserLoginLogRepos.GetAllAsync(item => item.DepartmentId == departmentId && item.IsActive == true);

            if (logUsers != null)
            {
                var listOrderBy = logUsers.OrderByDescending(o => o.FirstLogin).ToList();
                result = listOrderBy;
            }
            else
            {
                result = null;
            }

            return result;
        }

        public async Task<TransactionUserLoginLog> GetTransactionLoginLogByUserId(int userId)
        {

            var result = new TransactionUserLoginLog();
            var logUsers = await _unitOfWork.TransUserLoginLogRepos.GetAllAsync(item => item.UserId == userId && item.IsActive == true);

            if (logUsers != null)
            {
                var listOrderBy = logUsers.OrderByDescending(o => o.FirstLogin).FirstOrDefault();
                result = listOrderBy;
            }
            else
            {
                result = null;
            }
            return result;
        }

        public async Task<TransactionUserLoginLog> GetTransactionUserLoginLogById(int Id)
        {
            return await _unitOfWork.TransUserLoginLogRepos.GetAsync(item => item.LoginLogId == Id);
        }

        public async Task UpdateTransactionUserLoginLog(TransactionUserLoginLog entity)
        {
            ArgumentNullException.ThrowIfNull(entity);
            _unitOfWork.TransUserLoginLogRepos.Update(entity);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task<IEnumerable<UserLoginLogData>> GetLoginLogActiveByUserIdAsync(int userId,int departmentId)
        {
            return await _unitOfWork.TransUserLoginLogRepos.GetLoginLogActiveByUserIdAsync(userId, departmentId);
        }
    }
}
