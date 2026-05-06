using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;

namespace BSS_API.Services.Interface
{
    public interface IUnsortReceiveDeliveryService
    {       
        //Add By MarK
        Task<List<SendUnsortCCResponse>> LoadSendUnsortCCList(int departmentId,int userId, CancellationToken ct = default);
        Task<List<ContainerBySendUnsortIdResponse>> LoadContainerBySendUnsortIdList(string SendUnsortId, CancellationToken ct = default);
        Task<SendUnsortCCResponse> GetReceiveBySendUnsortCode(string SendUnsortCode, int departmentId, CancellationToken ct = default);

        Task<int> RemoveBinContainerNotPrepareData(int RegisterUnsortId, int UserId, CancellationToken ct = default);

        // --- เพิ่มเติมโดยการรับมอบ (Receive) ---
        // ส่งคืนค่าเป็น ServiceResponse หรือ bool เพื่อเช็คสถานะการทำงาน
        Task<bool> ExecuteReceiveDelivery(int sendUnsortId, int userId, CancellationToken ct = default);

        // --- เพิ่มเติมโดยการปฏิเสธการรับมอบ (Reject) ---
        // รับ note (เหตุผล) เพิ่มเติมจากหน้า Modal ที่เราสร้างไว้
        Task<bool> ExecuteRejectDelivery(int sendUnsortId, int userId, string note, CancellationToken ct = default);

        Task<bool> ExecuteReturnDelivery(List<int> ids, int userId, string note, CancellationToken ct = default);
        Task<UnsortCCReceiveResponse> UpdateRemainingQtyReceive(UpdateRemainingQtyReceiveRequest request, CancellationToken ct = default);
    }
}