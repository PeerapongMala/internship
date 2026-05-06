using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterCompanyDepartmentRepository : IGenericRepository<MasterCompanyDepartment>
    {
        Task<PagedData<MasterCompanyDepartment>> SearchMasterCompanyDepartment(
           PagedRequest<MasterCompanyDepartmentRequest> request,
           CancellationToken ct = default);

        Task<string> GetCbBcdCode(int departmentId, int institutionId);
        Task<string> GetCbBcdCode(int companyId);
    }
}
