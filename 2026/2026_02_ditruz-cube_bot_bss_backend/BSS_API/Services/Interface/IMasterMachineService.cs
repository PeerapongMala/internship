using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterMachineService
    {
        Task<IEnumerable<MasterMachine>> GetAllMachine();
        Task CreateMachine(CreateMachineRequest request);
        Task UpdateMachine(UpdateMachineRequest request);
        Task<MasterMachineViewData> GetMachineById(int Id);
        Task DeleteMachine(int Id);
        Task<IEnumerable<MasterMachineViewData>> GetMachineByFilter(MachineFilterRequest request);
        Task<IEnumerable<MasterMachineViewData>> GetMachineByDepartment(int departmentId);
        Task<IEnumerable<MasterMachine>> GetMachineByUniqueOrKey(string machineCode);
        Task<PagedData<MasterMachineViewData>> SearchMachine(PagedRequest<MasterMachineRequest> request);
    }
}
