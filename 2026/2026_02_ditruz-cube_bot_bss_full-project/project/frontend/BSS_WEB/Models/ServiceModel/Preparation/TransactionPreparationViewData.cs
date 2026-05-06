using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class TransactionPreparationViewData
    {
        public long prepareId { get; set; }

        public long containerPrepareId { get; set; }

        public string? containerCode { get; set; }

        public string headerCardCode { get; set; }

        public string packageCode { get; set; }

        public string bundleCode { get; set; }

        public int instId { get; set; }

        public string? institutionShortName { get; set; }

        public int? cashcenterId { get; set; }

        public string? cashCenterName { get; set; }

        public int? zoneId { get; set; }

        public string? zoneName { get; set; }

        public int? cashpointId { get; set; }

        public string? cashpointName { get; set; }

        public int denoId { get; set; }

        public int? denominationPrice { get; set; }

        public int qty { get; set; }

        public string? remark { get; set; }

        public int statusId { get; set; }

        public string? statusNameTh { get; set; }

        public DateTime prepareDate { get; set; }

        public bool? isReconcile { get; set; }

        public bool? isActive { get; set; }

        public int? createdBy { get; set; }

        public DateTime? createdDate { get; set; }

        public int? updatedBy { get; set; }

        public DateTime? updatedDate { get; set; }
    }
}
