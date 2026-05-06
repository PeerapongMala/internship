using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterBanknoteTypeSendService
    {
        Task<IEnumerable<MasterBanknoteTypeSend>> GetAllBanknoteTypeSend();
        Task CreateBanknoteTypeSend(CreateBanknoteTypeSendRequest request);
        Task UpdateBanknoteTypeSend(UpdateBanknoteTypeSendRequest request);
        Task<MasterBanknoteTypeSend> GetBanknoteTypeSendById(int Id);
        Task DeleteBanknoteTypeSend(int Id);
        Task<IEnumerable<MasterBanknoteTypeSend>> GetBanknoteTypeByUniqueOrKey(string banknoteTypeSendCode, string bssBntypeCode);
        Task<PagedData<MasterBanknoteTypeSend>> SearchBanknoteTypeSend(PagedRequest<MasterBanknoteTypeSendRequest> request);

    }
}
