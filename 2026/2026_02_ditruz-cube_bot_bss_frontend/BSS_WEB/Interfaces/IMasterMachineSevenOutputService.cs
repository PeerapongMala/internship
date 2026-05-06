using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterMachineSevenOutputService
    {
        Task<MasterMachineSevenOutputListResult> GetAllMasterMachineSevenOutputAsyn();
        Task<MasterMachineSevenOutputResult> GetMachineSevenOutputByIdAsync(int Id);
        Task<BaseServiceResult> UpdateMachineSevenOutputAsync(UpdateMachineSevenOutputRequest request);
        Task<BaseServiceResult> DeleteMachineSevenOutputAsync(int Id);
        Task<BaseServiceResult> CreateMachineSevenOutputAsync(CreateMachineSevenOutputRequest request);
        Task<MasterMachineSevenOutputPageResult> SearchMachineSevenOutputAsync(PagedRequest<MasterMachineSevenOutputRequest> request);
    }
}
