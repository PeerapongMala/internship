using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IRegisterUnsortService
    {
        Task<GetAllRegisterUnsortResult> GetRegisterUnsortAllAsync();
        Task<GetRegisterUnsortByIdResult> GetRegisterUnsortByIdAsync(long Id);
        Task<BaseServiceResult> UpdateRegisterUnsortAsync(RegisterUnsortDisplay request);

        Task<BaseApiResponse<ConfirmRegisterUnsortRequest>> EditRegisterUnsortContainerAsync(
            ConfirmRegisterUnsortRequest confirmRegisterUnsortRequest);


        Task<BaseApiResponse<ConfirmUnsortCCRequest>> EditUnsortCCStatusDeliveryAsync(
            ConfirmUnsortCCRequest confirmUnsortCCRequest);

        Task<BaseApiResponse<ConfirmRegisterUnsortRequest>> ConfirmRegisterUnsortAsync(ConfirmRegisterUnsortRequest request);
        Task<BaseServiceResult> DeleteRegisterUnsortAsync(long Id);

        Task<GetAllUnsortCCResult> GetUnsortCCAllAsync(long? registerUnsortId = null);
        Task<GetUnsortCCByIdResult> GetUnsortCCByIdAsync(long Id);
        Task<GetAllUnsortCCResult> GetUnsortCCByFilterAsync(UnsortCCDropdown request);

        Task<BaseServiceResult> UpdateUnsortCCAsync(UnsortCCDisplay request);
        Task<BaseServiceResult> DeleteUnsortCCAsync(long Id);
        Task<BaseServiceResult> CreateUnsortCCAsync(UnsortCCDisplay request);
        Task<BaseApiResponse<List<RegisterUnsortDataResponse>>?> LoadRegisterUnsortList(int DepartmentId);
    }
}
