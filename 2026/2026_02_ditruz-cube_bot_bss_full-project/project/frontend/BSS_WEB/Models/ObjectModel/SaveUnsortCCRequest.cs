using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class SaveUnsortCCRequest
    {
      
        public long unsortCCId { get; set; } = 0;

        public long registerUnsortId { get; set; } = 0;

        public int instId { get; set; } = 0;

        public int denoId { get; set; } = 0;

        public int banknoteType { get; set; } = 0;

        public int banknoteQty { get; set; } = 0;

        public int remainingQty { get; set; } = 0;

        public bool? isActive { get; set; } = false;

        public string containerCode { get; set; } = string.Empty;

        public string instNameTh { get; set; } = string.Empty;

        public int denoPrice { get; set; } = 0;
    }
}

