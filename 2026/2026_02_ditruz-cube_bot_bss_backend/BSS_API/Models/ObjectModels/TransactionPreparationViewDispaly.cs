using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class TransactionPreparationViewDisplay
    {
        public string PackageCode { get; set; }

        public string BundleCode { get; set; }

        public string HeaderCardCode { get; set; }

        public string? InstitutionShortName { get; set; }

        public string? CashCenterName { get; set; }

        public int? DenominationPrice { get; set; }

        public DateTime PrepareDate { get; set; }

        public string? ContainerCode { get; set; }

    }
}
