namespace BSS_API.Services.Interface
{
    using Models.Common;
    using Models.Entities;
    using Models.ObjectModels;
    using Models.RequestModels;
    using Models.ResponseModels;

    public interface ITransactionPreparationService
    {
        Task<IEnumerable<TransactionPreparation>> GetAllPreparation();
        Task<IEnumerable<TransactionPreparationViewDisplay>> GetPreparationByDepartment(int departmentId);
        Task<DummyBarcodeResult> GenerateDummyBarcodeAsync(CreateDummyBarcode request);
        Task CreatePreparation(CreatePreparationRequest request);
        Task UpdatePreparation(UpdatePreparationRequest request);
        Task DeletePreparation(long Id);
        Task<TransactionPreparation> GetPreparationByIdAsync(long prepareId);
        Task<IEnumerable<TransactionPreparationViewData>> GetAllPreparationAsync();
        Task CreateContainerBarcode(CreateContainerBarcodeRequest request);
        Task<TransactionContainerPrepare> CreateCaMemberContainerAsync(CreateContainerBarcodeRequest request);
        Task<BarcodePreviewResponse?> GetPreviewCaNonMemberGenerateBarcodeAsync(CreateContainerBarcodeRequest request);
        Task<TransactionContainerPrepare> CreateCaNonMemberContainerAsync(CreateContainerBarcodeRequest request);
        Task<BarcodePreviewResponse?> GetPreviewUnsortCCGenerateBarcodeAsync(CreateContainerBarcodeRequest request);
        Task<BarcodePreviewResponse?> GetPreviewCaMemberGenerateBarcodeAsync(CreateContainerBarcodeRequest request);
        Task<TransactionContainerPrepare> CreateUnSortCcContainerAsync(
            CreateContainerBarcodeRequest request);
        Task UpdatePreparationUnfit(UpdatePreparationUnfitRequest request);
        Task<List<DeletePreparationUnfitResponse>> DeletePreparationUnfit(List<DeletePreparationUnfitRequest> requests);
        Task<List<EditPreparationUnfitResponse>> EditPreparationUnfit(List<EditPreparationUnfitRequest> requests);
        Task<PagedData<PreparationUnfitResponse>> GetPreparationUnfitAsync(
            PagedRequest<PreparationUnfitRequest> request, CancellationToken ct = default);
        Task<CountPrepareResponseModel> GetCountPrepareByContainerAsync(CountPrepareByContainerRequest request);
        Task<CountReconcileResponseModel> GetCountReconcileAsync(GetCountReconcileRequest request);
        Task<TransactionContainerPrepare?> TestTransactionAsync();
        Task<List<DeletePreparationUnsortCaNonMemberResponse>> DeletePreparationUnsortCaNonMember(
            List<DeletePreparationUnsortCaNonMemberRequest> requests);
        Task<List<EditPreparationUnsortCaNonMemberResponse>> EditPreparationUnsortCaNonMember(
            List<EditPreparationUnsortCaNonMemberRequest> requests);
        Task<PagedData<PreparationUnsortCaNonMemberResponse>> GetPreparationUnsortCaNonMemberAsync(
            PagedRequest<PreparationUnsortCaNonMemberRequest> request, CancellationToken ct = default);
        Task<PagedData<PreparationUnsortCaMemberResponse>> GetPreparationUnsortCaMemberAsync(
            PagedRequest<PreparationUnsortCaMemberRequest> request,
            CancellationToken ct = default);
        Task<PagedData<PreparationUnsortCCResponse>?> GetPreparationUnsortCCAsync(
            PagedRequest<PreparationUnsortCCRequest> request,
            CancellationToken ct = default);
        Task<List<DeletePreparationUnsortCaMemberResponse>> DeletePreparationUnsortCaMember(
            List<DeletePreparationUnsortCaMemberRequest> requests);
        Task<List<EditPreparationUnsortCaMemberResponse>> EditPreparationUnsortCaMember(
            List<EditPreparationUnsortCaMemberRequest> requests);

        #region PreparationUnsortCC

        Task<List<EditPreparationUnsortCCResponse>> EditPreparationUnsortCC(
            List<EditPreparationUnsortCCRequest> requests);

        Task<List<DeletePreparationUnsortCCResponse>> DeletePreparationUnsortCC(
            List<DeletePreparationUnsortCCRequest> requests);

        #endregion PreparationUnsortCC

        Task<TransactionContainerPrepare> GetExistingTransactionContainerPrepare(
            ExistingTransactionContainerPrepareRequest request);
    }
}