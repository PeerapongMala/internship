using BSS_API.Models;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;

namespace BSS_API.Services.Interface
{
    public interface IReportService
    {
        Task<reportBankSummaryResponse> GetDataReport(reportBankSummaryRequest request);

        Task<reportCashPointCenterResponse> GetDataReport_CashPointCashCenter(reportCashPointCenterRequest request);

        Task<IEnumerable<DropdownItemResponse>> GetHeaderCardListAsync(reportGetHeaderCardListRequest request);

        Task<reportSingleHeaderCardResponse> GetDataReport_SingleHeaderCard(reportSingleHeaderCardRequest request);

        Task<reportMultiHeaderCardResponse> GetDataReport_MultiHeaderCard(reportMultiHeaderCardRequest request);
        Task<reportContainerResponse> GetDataReport_Container(reportContainerRequest request);
        Task<reportAbnormalResponse> GetDataReport_Abnormal(reportAbnormalRequest request);
    }
}
