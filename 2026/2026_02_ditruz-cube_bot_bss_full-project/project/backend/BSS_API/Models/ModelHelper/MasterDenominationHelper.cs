namespace BSS_API.Models.ModelHelper
{
    using BSS_API.Models.ObjectModels;
    using Entities;
    using SearchParameter;

    public static class MasterDenominationHelper
    {
        public static ICollection<DropDownItemResponse<MasterDenomination>> ToDropDownItem(
            this ICollection<MasterDenomination> masterDenominations, bool includeRowData = false)
        {
            ICollection<DropDownItemResponse<MasterDenomination>> itemResponse =
                new List<DropDownItemResponse<MasterDenomination>>();
            foreach (var masterDenomination in masterDenominations)
            {
                itemResponse.Add(new DropDownItemResponse<MasterDenomination>
                {
                    Key = masterDenomination.DenominationId,
                    Text = masterDenomination.DenominationPrice.ToString(),
                    Value = masterDenomination.DenominationId,
                    RowData = includeRowData ? masterDenomination : null
                });
            }

            return itemResponse;
        }

        public static ICollection<DropDownItemResponse<MasterDenoUnsortCcViewData>> ToDropDownItem(
            this ICollection<MasterDenoUnsortCcViewData> masterDenominations, bool includeRowData = false)
        {
            ICollection<DropDownItemResponse<MasterDenoUnsortCcViewData>> itemResponse =
                new List<DropDownItemResponse<MasterDenoUnsortCcViewData>>();
            foreach (var masterDenomination in masterDenominations)
            {
                itemResponse.Add(new DropDownItemResponse<MasterDenoUnsortCcViewData>
                {
                    Key = masterDenomination.DenoId,
                    Text = masterDenomination.DenoPrice.ToString(),
                    Value = masterDenomination.DenoId,
                    RowData = includeRowData ? masterDenomination : null
                });
            }

            return itemResponse;
        }
    }
}