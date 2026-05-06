namespace BSS_API.Models.ModelHelper
{
    using Entities;
    using SearchParameter;

    public static class MasterUserHelper
    {
        public static ICollection<DropDownItemResponse<MasterUser>> ToDropDownItem(
            this ICollection<MasterUser> masterUsers, bool includeRowData = false)
        {
            ICollection<DropDownItemResponse<MasterUser>> itemResponse = new List<DropDownItemResponse<MasterUser>>();
            foreach (var masterUser in masterUsers)
            {
                itemResponse.Add(new DropDownItemResponse<MasterUser>
                {
                    Key = masterUser.UserId,
                    Text = $"{masterUser.FirstName} ({masterUser.LastName})",
                    Value = masterUser.UserId,
                    RowData = includeRowData ? masterUser : null
                });
            }

            return itemResponse;
        }
    }
}