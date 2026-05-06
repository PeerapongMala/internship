using BSS_API.Models.Entities;

namespace BSS_API.Services.Interface
{
    public interface IMasterUserHistoryService
    {
        Task<IEnumerable<MasterUserHistory>> GetAllUserHistorys();
        Task CreateUserHistory(MasterUserHistory entity);
        Task<MasterUserHistory> GetUserHistoryById(int Id);
    }
}
