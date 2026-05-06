namespace BSS_API.Models.RequestModels
{
    using Core.Constants;
    using System.ComponentModel.DataAnnotations;

    
    public class PreparationUnsortCCRequest
    {
        [Required] public int DepartmentId { get; set; }
        public int? MachineId { get; set; }
        public bool IsReconcile { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public int StatusId { get; set; } = BssStatusConstants.Prepared;
        public int BnTypeId { get; set; } = BNTypeConstants.UnsortCC;
    }
}
