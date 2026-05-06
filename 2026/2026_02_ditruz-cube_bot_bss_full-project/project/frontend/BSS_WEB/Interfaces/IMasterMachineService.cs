using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterMachineService
    {
        Task<MasterMachineListResult> GetMachineAllAsync();
        Task<MasterMachineResult> GetMachineByIdAsync(int Id);
        Task<BaseServiceResult> UpdateMachineAsync(UpdateMachineRequest request);
        Task<BaseServiceResult> CreateMachineAsync(CreateMachineRequest request);
        Task<BaseServiceResult> DeleteMachineAsync(int Id);
        Task<MasterMachineListResult> GetMachineByFilterAsync(MachineFilterSearch request);
        Task<MachineDepartmentResult> GetMachineByDepartmentAsync(int departmentId);
        Task<MasterMachinePageResult> SearchMachineAsync(PagedRequest<MasterMachineRequest> request);
    }
}
