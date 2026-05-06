namespace BSS_API.Models.ModelHelper
{
    using Entities;
    using SearchParameter;
    
    public static class MasterRoleHelper
    {
        public static ICollection<DropDownItemResponse<MasterUser>> ToDropDownItem(
            this ICollection<MasterRole> masterRoles, bool includeRowData = false)
        {
            ICollection<DropDownItemResponse<MasterUser>> itemResponse =
                new List<DropDownItemResponse<MasterUser>>();
            foreach (var masterRole in masterRoles)
            {
                itemResponse.Add(new DropDownItemResponse<MasterUser>
                {
                    /*Key = masterRole.MasterRoleGroup.MasterUserRole.,
                    Text = $"{masterUserRole.MasterUser.FirstName} {masterUserRole.MasterUser.LastName}",
                    Value = masterUserRole.UserId,
                    RowData = includeRowData ? masterUserRole.MasterUser : null*/
                });
            }

            return itemResponse;
        }
    }
}
