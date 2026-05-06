using BSS_API.Models.Entities;
using BSS_API.Models.SearchParameter;

namespace BSS_API.Models.ModelHelper
{
    public  static class MasterMachineHelper
    {
        public static ICollection<DropDownItemResponse<MasterMachine>> ToDropDownItem(
            this ICollection<MasterMachine> masterMachines, bool includeRowData = false)
        {
            ICollection<DropDownItemResponse<MasterMachine>> itemResponse =
                new List<DropDownItemResponse<MasterMachine>>();
            foreach (var masterMachine in masterMachines)
            {
                itemResponse.Add(new DropDownItemResponse<MasterMachine>
                {
                    Key = masterMachine.MachineId,
                    Text = masterMachine.MachineName,
                    Value = masterMachine.MachineId,
                    RowData = includeRowData ? masterMachine : null
                });
            }

            return itemResponse;
        }
    }
}
