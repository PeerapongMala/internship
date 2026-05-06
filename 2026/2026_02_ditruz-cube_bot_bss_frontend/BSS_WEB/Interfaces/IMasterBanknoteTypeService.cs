using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.MasterData;

namespace BSS_WEB.Interfaces
{
    public interface IMasterBanknoteTypeService
    {
        Task<MasterBanknoteTypeListResult> GetAllBanknoteTypeAsyn();
        Task<MasterBanknoteTypeResult> GetBanknoteTypeByIdAsync(int Id);
        Task<BaseServiceResult> UpdateBanknoteTypeAsync(UpdateBanknoteTypeRequest request);
        Task<BaseServiceResult> DeleteBanknoteTypeAsync(int Id);
        Task<BaseServiceResult> CreateBanknoteTypeAsync(CreateBanknoteTypeRequest request);
        Task<MasterBanknoteTypePageResult> SearchBanknoteTypeAsync(PagedRequest<MasterBanknoteTypeRequest> request);
    }
}
