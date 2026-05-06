namespace BSS_API.Models.RequestModels
{
    using System.ComponentModel.DataAnnotations;

    public class ConfirmRegisterUnsortRequest
    {
        public long? id { get; set; }

        public string container { get; set; }

        public int companyId { get; set; }

        public int departmentId { get; set; }

        public int statusId { get; set; }

        public string? statusNameTh { get; set; }

        public DateTime receivedDate { get; set; }

        public string remark { get; set; }

        public bool isActive { get; set; } = false;

        public int createdBy { get; set; }

        public DateTime createdDate { get; set; }

        public int? updatedBy { get; set; }

        public DateTime? updatedDate { get; set; }

        public ICollection<ConfirmUnsortCCRequest>? unsortCC { get; set; }
    }

    public class ConfirmUnsortCCRequest
    {
        public long? unsortCCId { get; set; }

        [Required] public long registerUnsortId { get; set; }

        public int instId { get; set; }

        public string instNameTh { get; set; }

        public int denoId { get; set; }

        public string denoName { get; set; }

        public int banknoteQty { get; set; }

        public int remainingQty { get; set; }

        public int? adjustQty { get; set; }

        public bool isActive { get; set; } = false;
    }
}