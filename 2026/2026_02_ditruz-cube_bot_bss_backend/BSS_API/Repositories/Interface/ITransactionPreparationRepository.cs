namespace BSS_API.Repositories.Interface
{
    using Models.Entities;
    using Models.ObjectModels;
    using Models.RequestModels;
    using Models.ResponseModels;
    using BSS_API.Models.Common;

    public interface ITransactionPreparationRepository : IGenericRepository<TransactionPreparation>
    {
        Task<TransactionPreparation?> GetLastTransactionPreparationWithContainerIdAsync(long containerId);

        public Task<IEnumerable<TransactionPreparationViewData>> GetAllPreparationAsync();

        public Task<TransactionPreparation?> GetPreparationByIdAsync(long prepareId);

        Task<PagedData<PreparationUnfitResponse>> GetPreparationUnfitAsync(
            PagedRequest<PreparationUnfitRequest> request, CancellationToken ct = default);

        Task<TransactionPreparation?> ValidateHeaderCardIsExistingAsync(string headerCard, DateTime startDate,
            DateTime endDate, int? departmentId = null, int? machineId = null);

        Task<bool> IsAllPrepareDeletedInContainerAsync(long containerPrepareId);

        Task<List<TransactionPreparation>> GetPreparationByIdsAsync(List<long> prepareIds);

        Task<PagedData<PreparationUnsortCaNonMemberResponse>> GetPreparationUnsortCaNonMemberAsync(
            PagedRequest<PreparationUnsortCaNonMemberRequest> request, CancellationToken ct = default);

        Task<PagedData<PreparationUnsortCaMemberResponse>> GetPreparationUnsortCaMemberAsync(
            PagedRequest<PreparationUnsortCaMemberRequest> request, CancellationToken ct = default);

        Task<PagedData<PreparationUnsortCCResponse>> GetPreparationUnsortCCAsync(
            PagedRequest<PreparationUnsortCCRequest> request, CancellationToken ct = default);

        Task<CountPrepareResponseModel> GetCountPrepareByContainerAsync(CountPrepareByContainerRequest request, DateTime startDate, DateTime endDate);

        Task<CountReconcileResponseModel> GetCountReconcileAsync(GetCountReconcileRequest request);

        Task<TransactionPreparation?> CheckTransactionPreparationBarcodeIsDuplicateAsync(string containerCode, string barcodeWrap,
            string barcodeBundle, DateTime startDate, DateTime endDate);

        Task<ICollection<TransactionPreparation>> GetAllTransactionPreparationWithPrepareIdAsync(long[] prepareId,
            int departmentId, string bssBnTypeCode);

        Task<bool> ExistsPackageCodeAsync(string packageCode);

        Task<string?> GetLatestPackageCodeByPrefixAsync(string prefix);
        Task<TransactionPreparation?> CheckLatestBundleBarcodeAsync(long ReceiveId);
    }
}