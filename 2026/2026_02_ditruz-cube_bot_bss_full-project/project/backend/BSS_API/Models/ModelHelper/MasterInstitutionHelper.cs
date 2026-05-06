namespace BSS_API.Models.ModelHelper
{
    using Entities;
    using SearchParameter;

    public static class MasterInstitutionHelper
    {
        public static ICollection<DropDownItemResponse<MasterInstitution>> ToDropDownItem(
            this ICollection<MasterInstitution> masterInstitutions, bool includeRowData = false)
        {
            ICollection<DropDownItemResponse<MasterInstitution>> itemResponse =
                new List<DropDownItemResponse<MasterInstitution>>();
            foreach (var masterInstitution in masterInstitutions)
            {
                itemResponse.Add(new DropDownItemResponse<MasterInstitution>
                {
                    Key = masterInstitution.InstitutionId,
                    Text = masterInstitution.InstitutionNameTh,
                    Value = masterInstitution.BankCode,
                    RowData = includeRowData ? masterInstitution : null
                });
            }

            return itemResponse;
        }
    }
}