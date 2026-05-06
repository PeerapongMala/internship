namespace BSS_API.Models
{
    public class reportBankSummaryRequest
    {
        public int RequestByUserId { get; set; } = 0;
        public int DepartmentId { get; set; } = 0;
        /// <summary>
        /// รองรับทั้ง ID (string) และค่า "all"
        /// </summary>
        public string MachineId { get; set; } = "all";

        /// <summary>
        /// รองรับทั้ง ID (string) และค่า "all"
        /// </summary>
        public string InstitutionId { get; set; } = "all";

        /// <summary>
        /// ประเภทเงิน (เช่น 1 = ธนบัตร)
        /// </summary>
        public string CashTypeId { get; set; }

        /// <summary>
        /// ชนิดราคา รองรับ "all"
        /// </summary>
        public string DenominationId { get; set; } = "all";

        /// <summary>
        /// วันที่ในรูปแบบ dd/MM/yyyy (พ.ศ.)
        /// </summary>
        public string Date { get; set; }

        public string shift { get; set; } = "all";
    }
}
