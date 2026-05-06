namespace BSS_API.Models.ModelHelper
{
    using Entities;
    using SearchParameter;

    public static class MasterShiftHelper
    {
        public static ICollection<DropDownItemResponse<MasterShift>> ToDropDownItem(
            this ICollection<MasterShift> masterShifts, bool includeRowData = false)
        {
            ICollection<DropDownItemResponse<MasterShift>> itemResponse = new List<DropDownItemResponse<MasterShift>>();
            foreach (var masterShift in masterShifts)
            {
                itemResponse.Add(new DropDownItemResponse<MasterShift>
                {
                    Key = masterShift.ShiftId,
                    Text = masterShift.ShiftName,
                    Value = masterShift.ShiftId,
                    RowData = null
                });
            }

            return itemResponse;
        }
    }
}
