using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterDepartmentService
    {
        Task<IEnumerable<MasterDepartment>> GetAllDepartment();
        Task CreateDepartment(CreateDepartmentRequest request);
        Task UpdateDepartment(UpdateDepartmentRequest request);
        Task<MasterDepartmentViewData> GetDepartmentById(int Id);
        Task DeleteDepartment(int Id);
        Task<IEnumerable<MasterDepartmentViewData>> GetDepartmentByFilter(DepartmentFilterRequest filter);
        Task<IEnumerable<MasterDepartment>> GetDepartmentByUniqueOrKey(string departmentCode);
        Task<PagedData<MasterDepartment>> SearchDepartment(PagedRequest<MasterDepartmentRequest> req);
    }
}
