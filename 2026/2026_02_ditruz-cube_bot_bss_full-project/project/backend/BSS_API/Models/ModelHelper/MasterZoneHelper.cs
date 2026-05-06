namespace BSS_API.Models.ModelHelper
{
    using BSS_API.Models.ObjectModels;
    using Entities;
    using SearchParameter;

    public static class MasterZoneHelper
    {
        public static ICollection<DropDownItemResponse<MasterZone>> ToDropDownItem(
            this ICollection<MasterZone> masterZones, bool includeRowData = false)
        {
            ICollection<DropDownItemResponse<MasterZone>> itemResponse = new List<DropDownItemResponse<MasterZone>>();
            foreach (var masterZone in masterZones)
            {
                itemResponse.Add(new DropDownItemResponse<MasterZone>
                {
                    Key = masterZone.ZoneId,
                    Text = masterZone.ZoneName,
                    Value = masterZone.ZoneCode,
                    RowData = includeRowData ? masterZone : null
                });
            }

            return itemResponse;
        }

        public static ICollection<DropDownItemResponse<MasterZoneUnsortCcViewData>> ToDropDownItem(
            this ICollection<MasterZoneUnsortCcViewData> masterZones, bool includeRowData = false)
        {
            ICollection<DropDownItemResponse<MasterZoneUnsortCcViewData>> itemResponse = new List<DropDownItemResponse<MasterZoneUnsortCcViewData>>();
            foreach (var masterZone in masterZones)
            {
                itemResponse.Add(new DropDownItemResponse<MasterZoneUnsortCcViewData>
                {
                    Key = masterZone.ZoneId,
                    Text = masterZone.ZoneName,
                    Value = masterZone.ZoneCode,
                    RowData = includeRowData ? masterZone : null
                });
            }

            return itemResponse;
        }
    }
}