namespace BSS_API.Repositories.Interface
{
    using Models.Entities;
    using Models.RequestModels;
    using Models.ResponseModels;

    public interface ITransactionSendUnsortCCRepository : IGenericRepository<TransactionSendUnsortCC>
    {
        Task<bool> CheckSendUnsortCCExistWithDeliveryCodeAsync(string deliveryCode);

        //Add By MarK
        Task<List<SendUnsortCCResponse>> GetSendUnsortCCDetailsAsync(int departmentId, DateTime startDateTime,
            DateTime endDateTime, CancellationToken ct = default);

        Task<List<ContainerBySendUnsortIdResponse>> GetContainerBySendUnsortId(string SendUnsortId,
            CancellationToken ct = default);

        Task<SendUnsortCCResponse> GetReceiveBySendUnsortCode(string SendUnsortCode, int departmentId,
            DateTime startDateTime,
            DateTime endDateTime, CancellationToken ct = default);

        Task<TransactionSendUnsortCC?> GetTransactionSendUnsortCCAndIncludeDataForPrintReportBySendUnsortIdAsync(
            long sendUnsortId);

        Task<TransactionSendUnsortCC?> GetTransactionSendUnsortCCAndIncludeDataBySendUnsortIdAsync(long sendUnsortId);

        Task<TransactionSendUnsortCC?> GetTransactionSendUnsortCCAndIncludeDataForEditSendUnsortDeliveryAsync(
            long sendUnsortId, int departmentId);

        Task<ICollection<TransactionSendUnsortCC>?> GetSendUnsortCCForRegisterUnsortDeliverAsync(int departmentId,
            ICollection<int> statusIn,
            DateTime startDateTime, DateTime endDateTime);

        Task<bool> RemoveBinContainerNotPrepareData(int RegisterUnsortId, int UserId, CancellationToken ct = default);

        Task<bool> UpdateSendUnsortStatusAsync(int SendUnsortId, int UserId, int statusId, string? note,
            CancellationToken ct = default);

        Task<UnsortCCReceiveResponse> UpdateRemainingQtyReceive(UpdateRemainingQtyReceiveRequest request, CancellationToken ct = default);
    }
}