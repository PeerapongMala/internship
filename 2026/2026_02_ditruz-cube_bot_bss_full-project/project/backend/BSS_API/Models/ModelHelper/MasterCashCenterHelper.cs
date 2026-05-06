namespace BSS_API.Models.ModelHelper
{
    using Entities;
    using SearchParameter;

    public static class MasterCashCenterHelper
    {
        public static ICollection<DropDownItemResponse<MasterCashCenter>> ToDropDownItem(
            this ICollection<MasterCashCenter> masterCashCenters, bool includeRowData = false)
        {
            ICollection<DropDownItemResponse<MasterCashCenter>> itemResponse =
                new List<DropDownItemResponse<MasterCashCenter>>();
            foreach (var masterCashCenter in masterCashCenters)
            {
                itemResponse.Add(new DropDownItemResponse<MasterCashCenter>
                {
                    Key = masterCashCenter.CashCenterId,
                    Text = masterCashCenter.CashCenterName,
                    Value = masterCashCenter.CashCenterId,
                    RowData = includeRowData ? masterCashCenter : null
                });
            }

            return itemResponse;
        }
    }
}