using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.SearchParameter;

namespace BSS_API.Models.ModelHelper
{
    public static class MasterCashPointHelper
    {
        public static ICollection<DropDownItemResponse<MasterCashPoint>> ToDropDownItem(
            this ICollection<MasterCashPoint> masterCashPoints, bool includeRowData = false)
        {
            ICollection<DropDownItemResponse<MasterCashPoint>> itemResponse =
                new List<DropDownItemResponse<MasterCashPoint>>();
            foreach (var masterCashPoint in masterCashPoints)
            {
                itemResponse.Add(new DropDownItemResponse<MasterCashPoint>
                {
                    Key = masterCashPoint.CashpointId,
                    Text = masterCashPoint.CashpointName,
                    Value = masterCashPoint.CashpointId,
                    Code = masterCashPoint.BranchCode,
                    RowData = includeRowData ? masterCashPoint : null
                });
            }

            return itemResponse;
        }

        public static ICollection<DropDownItemResponse<MasterCashPointUnsortCcViewData>> ToDropDownItem(
            this ICollection<MasterCashPointUnsortCcViewData> masterCashPoints, bool includeRowData = false)
        {
            ICollection<DropDownItemResponse<MasterCashPointUnsortCcViewData>> itemResponse = new List<DropDownItemResponse<MasterCashPointUnsortCcViewData>>();
            foreach (var masterCashPoint in masterCashPoints)
            {
                itemResponse.Add(new DropDownItemResponse<MasterCashPointUnsortCcViewData>
                {
                    Key = masterCashPoint.CashpointId,
                    Text = masterCashPoint.CashpointName,
                    Code = masterCashPoint.BranchCode,
                    Value = masterCashPoint.ZoneCode,
                    RowData = includeRowData ? masterCashPoint : null
                });
            }

            return itemResponse;
        }
    }
}
