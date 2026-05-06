namespace BSS_API.Services.Interface
{
    using Models.Report.Preparation;
    using Models.Report.RegisterUnsort;

    public interface IBssReportService
    {
        Task<bool> CheckSupervisorOnlineAsync(int departmentId);

        Task<PreparationUnfitReportModel> GetPreparationUnfitReportAsync(
            PreparationUnfitReportRequest preparationUnfitReportRequest);

        Task<PreparationUnsortCAMemberReportModel> GetPreparationCAMemberReportAsync(
            PreparationUnsortCAMemberReportRequest preparationUnsortCaMemberReportRequest);

        Task<PreparationUnsortCANonMemberReportModel> GetPreparationCANonMemberReportAsync(
            PreparationUnsortCANonMemberReportRequest preparationUnsortCaNonMemberReportRequest);

        Task<PreparationUnsortCCReportModel> GetPreparationUnsortCCReportAsync(
            PreparationUnsortCCReportRequest preparationUnsortCcReportRequest);

        Task<RegisterUnsortReportModel> GetRegisterUnsortReportModelAsync(
            RegisterUnsortReportRequest registerUnsortReportRequest);

        Task<SendUnsortDeliveryReportModel> GetSendUnsortDeliveryReportAsync(
            SendUnsortDeliveryRequest sendUnsortDeliveryRequest);
    }
}