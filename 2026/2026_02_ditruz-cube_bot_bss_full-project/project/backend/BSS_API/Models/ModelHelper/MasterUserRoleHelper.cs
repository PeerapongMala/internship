using BSS_API.Models.Entities;
using BSS_API.Models.SearchParameter;

namespace BSS_API.Models.ModelHelper
{
    public static class MasterUserRoleHelper
    {
        public static ICollection<DropDownItemResponse<MasterUser>> ToDropDownItem(
            this ICollection<MasterUserRole> masterUserRoles, bool includeRowData = false)
        {
            ICollection<DropDownItemResponse<MasterUser>> itemResponse =
                new List<DropDownItemResponse<MasterUser>>();
            foreach (var masterUserRole in masterUserRoles)
            {
                itemResponse.Add(new DropDownItemResponse<MasterUser>
                {
                    Key = masterUserRole.UserId,
                    Text = $"{masterUserRole.MasterUser.FirstName} {masterUserRole.MasterUser.LastName}",
                    Value = masterUserRole.UserId,
                    RowData = includeRowData ? masterUserRole.MasterUser : null
                });
            }

            return itemResponse;
        }
    }
}