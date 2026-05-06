using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterMachineTypeService
    {
        Task<MasterMachineTypeListResult> GetMachineTypeAllAsync();
        Task<MasterMachineTypeResult> GetMachineTypeByIdAsync(int Id);
        Task<BaseServiceResult> UpdateMachineTypeAsync(UpdateMachineTypeRequest request);
        Task<BaseServiceResult> CreateMachineTypeAsync(CreateMachineTypeRequest request);
        Task<BaseServiceResult> DeleteMachineTypeAsync(int Id);
        Task<MasterMachineTypePageResult> SearchMachineTypeAsync(PagedRequest<MasterMachineTypeRequest> request);
        
    }
}
