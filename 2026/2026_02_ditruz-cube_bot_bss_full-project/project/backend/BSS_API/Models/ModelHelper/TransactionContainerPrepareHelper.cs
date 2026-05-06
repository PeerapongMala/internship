namespace BSS_API.Models.ModelHelper
{
    using Entities;
    using ResponseModels;

    public static class TransactionContainerPrepareHelper
    {
        public static ICollection<PreparationAllTypeResponse> GetPreparationAllTypeResponse(
            this TransactionContainerPrepare transactionContainerPrepare)
        {
            ICollection<PreparationAllTypeResponse>
                preparationAllTypeResponses = new List<PreparationAllTypeResponse>();

            foreach (var transactionPreparation in transactionContainerPrepare.TransactionPreparation)
            {
                preparationAllTypeResponses.Add(new PreparationAllTypeResponse
                {
                    PrepareId = transactionPreparation.PrepareId,
                    ContainerPrepareId = transactionContainerPrepare.ContainerPrepareId,
                    UnSortCCId = transactionPreparation.TransactionUnsortCCId,
                    ContainerCode = transactionContainerPrepare.ContainerCode,
                    Barcode = transactionContainerPrepare.ContainerCode,
                    PackageCode = transactionPreparation.PackageCode,
                    BundleCode = transactionPreparation.BundleCode,
                    HeaderCardCode = transactionPreparation.HeaderCardCode,
                    BankCode = transactionPreparation.MasterInstitution?.BankCode,
                    CashCenterName = transactionPreparation.MasterCashCenter?.CashCenterName,
                    CashPointName = transactionPreparation.MasterCashPoint?.CashpointName,
                    DenominationPrice = transactionPreparation.MasterDenomination?.DenominationPrice,
                    ZoneId = transactionPreparation.MasterZone?.ZoneId,
                    ZoneName = transactionPreparation.MasterZone?.ZoneName,
                    CreatedBy = transactionPreparation.CreatedBy,
                    CreatedByName =
                        $"{transactionPreparation.CreatedByUser?.FirstName}  {transactionPreparation.CreatedByUser?.LastName}",
                    CreatedDate = transactionPreparation.CreatedDate,
                    UpdatedBy = transactionPreparation.UpdatedBy,
                    UpdatedDate = transactionPreparation.UpdatedDate,
                    UpdatedByName =
                        $"{transactionPreparation.UpdatedByUser?.FirstName}  {transactionPreparation.UpdatedByUser?.LastName}",
                    IsFlag = false
                });
            }

            return preparationAllTypeResponses;
        }
    }
}