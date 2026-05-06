using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchParameter;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Services
{
    public class MasterDropdownService : BaseApiClient , IMasterDropdownService
    {

        public MasterDropdownService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<MasterDropdownService> logger) : base(client , logger , contextAccessor)
        {
        }

        public async Task<BaseApiResponseWithData<List<DropDownItemResponse<object>>>> GetMasterDropdownAsync(SystemSearchRequest request)
        {
            return await SendAsync<BaseApiResponseWithData<List<DropDownItemResponse<object>>>>(HttpMethod.Post, $"api/MasterDropdown/GetDropDown", request);
        }
        public async Task<BaseApiResponseWithData<List<DropDownItemResponse<GetAllMasterCashPoint>>>> GetMasterDropdownChashpointWithZoneAsync(SystemSearchRequest request)
        {
            return await SendAsync<BaseApiResponseWithData<List<DropDownItemResponse<GetAllMasterCashPoint>>>>(HttpMethod.Post, $"api/MasterDropdown/GetDropDown", request);
        }
    }
}
