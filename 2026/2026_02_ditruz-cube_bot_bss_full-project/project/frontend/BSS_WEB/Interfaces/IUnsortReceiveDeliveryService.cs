using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IUnsortReceiveDeliveryService
    {
       
        Task<BaseApiResponse<List<SendrUnsortCCDataResponse>>?> LoadSendUnsortCCList(int DepartmentId,int UserId);
        Task<BaseApiResponse<SendrUnsortCCDataResponse>?> GetUnsortReceiveDeliverly(int DepartmentId,string SendUnsortCode);        
        Task<BaseApiResponse<int>?> RemoveBinContainerNotPrepareData(int SendUnsortId, int UserId);
        Task<BaseApiResponse<bool>?> ExecuteReceiveDelivery(int sendUnsortId, int userId);
        Task<BaseApiResponse<bool>?> ExecuteRejectDelivery(int sendUnsortId, int userId, string note);
        Task<BaseApiResponse<bool>?> ExecuteReturnDelivery(List<int> ids, int userId, string note);
        Task<BaseApiResponse<UnsortCCReceiveResponse>?> UpdateRemainingQtyReceive(UpdateRemainingQtyReceiveRequest request);
    }
}
