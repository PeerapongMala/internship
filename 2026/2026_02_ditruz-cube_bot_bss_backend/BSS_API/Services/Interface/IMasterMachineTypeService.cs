using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterMachineTypeService
    {
        Task<IEnumerable<MasterMachineType>> GetAllMachineType();
        Task<IEnumerable<MasterMachineType>> GetMachineTypeByUniqueOrKey(string machineTypeCode);
        Task CreateMachineType(CreateMachineTypeRequest request);
        Task UpdateMachineType(UpdateMachineTypeRequest request);
        Task<MasterMachineTypeViewData> GetMachineTypeById(int Id);
        Task DeleteMachineType(int Id);
        Task<PagedData<MasterMachineType>> SearchMachineType(PagedRequest<MasterMachineTypeRequest> request);


    }
}
