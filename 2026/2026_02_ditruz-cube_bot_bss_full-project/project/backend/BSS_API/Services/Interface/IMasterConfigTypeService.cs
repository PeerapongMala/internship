using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterConfigTypeService
    {
        Task<IEnumerable<MasterConfigType>> GetAllConfigType();
        Task CreateConfigType(CreateConfigTypeRequest request);
        Task UpdateConfigType(UpdateConfigTypeRequest request);
        Task<MasterConfigType?> GetConfigTypeById(int Id);
        Task DeleteConfigType(int Id);
        Task<IEnumerable<MasterConfigType>> GetConfigTypeByUniqueOrKey(string configTypeCode);
        Task<PagedData<MasterConfigType>> SearchConfigType(PagedRequest<MasterConfigTypeRequest> request);
    }

}
