using BSS_API.Models.Entities;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;

namespace BSS_API.Services
{
    public class MasterUserHistoryService : IMasterUserHistoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterUserHistoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateUserHistory(MasterUserHistory entity)
        {
            await _unitOfWork.UserHistoryRepos.AddAsync(entity);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task<IEnumerable<MasterUserHistory>> GetAllUserHistorys()
        {
            return await _unitOfWork.UserHistoryRepos.GetAllAsync();
        }

        public async Task<MasterUserHistory> GetUserHistoryById(int Id)
        {
            return await _unitOfWork.UserHistoryRepos.GetAsync(item => item.RoleGroupId == Id);
        }
    }
}
