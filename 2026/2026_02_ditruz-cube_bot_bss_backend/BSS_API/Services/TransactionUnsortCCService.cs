namespace BSS_API.Services
{
    using Helpers;
    using Interface;
    using Core.Constants;
    using Models.Entities;
    using Models.ModelHelper;
    using Models.RequestModels;
    using Models.ResponseModels;
    using BSS_API.Repositories.Interface;

    public class TransactionUnsortCCService : ITransactionUnsortCCService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TransactionUnsortCCService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<TransactionRegisterUnsort>> CheckValidateTransactionUnSortCcAsync(
            ValidateTransactionUnSortCcRequest request)
        {
            try
            {
                // Todo add start date and end date
                var masterConfigs =
                    await _unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync(ConfigConstants.BSS_WORK_DAY);
                request.StartDate = masterConfigs.ToScanPrepareBssWorkDayStartDateTime();
                request.EndDate = masterConfigs.ToScanPrepareBssWorkDayEndDateTime();

                var result = await _unitOfWork.TransactionUnsortCCRepos.CheckValidateTransactionUnSortCcAsync(request);

                foreach (var item in result)
                {
                    // step 1: company + inst  
                    var instId = item.TransactionUnsortCCs?.FirstOrDefault()?.InstId;
                    var companyInst = await _unitOfWork.CompanyInstitutionRepos
                        .GetByInstitutionByInstIdAsync(request.CompanyId, Convert.ToInt32(instId));

                    if (companyInst == null)
                    {
                        var masterInst = await _unitOfWork.InstitutionRepos
                            .GetMasterInstitutionByInstIdAsync(Convert.ToInt32(instId));

                        if (masterInst == null)
                            throw new Exception($"ไม่พบธนาคาร InstitutionId:{instId} ในฐานข้อมูลของระบบ");

                        throw new Exception($"ไม่พบธนาคาร {masterInst.InstitutionShortName} ในฐานข้อมูลของระบบ");
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
                ;
            }
        }

        public Task<UnsortCCResponse?> GetPreparationUnsortCCById(long unsortCCId)
        {
            try
            {
                var unsortCC = _unitOfWork.TransactionUnsortCCRepos.Get(
                    x => x.UnsortCCId == unsortCCId,
                    includeProperties: "MasterInstitution,MasterDenomination",
                    tracked: false);

                if (unsortCC == null)
                    return Task.FromResult<UnsortCCResponse?>(null);

                var result = new UnsortCCResponse
                {
                    UnsortCCId = unsortCC.UnsortCCId,
                    InstNameTh = unsortCC.MasterInstitution?.InstitutionNameTh,
                    DenoPrice = (decimal)unsortCC.MasterDenomination?.DenominationPrice,
                    BanknoteType = BNType.UnsortCC.ToInt(),
                    BanknoteQty = unsortCC.BanknoteQty,
                    RemainingQty = unsortCC.RemainingQty,
                    IsActive = unsortCC.IsActive ?? false,
                    CreatedDate = unsortCC.CreatedDate
                };

                return Task.FromResult<UnsortCCResponse?>(result);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<TransactionUnsortCC> GetExistingTransactionContainerPrepare(
            ExistingTransactionContainerPrepareRequest request)
        {
            TransactionUnsortCC? transactionContainerPrepare;

            try
            {
                var unSortCcData =
                    await _unitOfWork.TransactionUnsortCCRepos.GetAsync(w =>
                        w.UnsortCCId == request.ReceiveId &&
                        w.InstId == request.InstitutionId &&
                        w.DenoId == request.DenominationId, tracked: true);

                if (unSortCcData == null)
                {
                    throw new Exception("unsort cc data is null or empty.");
                }

                transactionContainerPrepare =
                    await _unitOfWork.TransactionUnsortCCRepos
                        .GetUnsortCcTransactionContainerPrepareAndIncludePrepareWithReceiveIdAsync(
                            unSortCcData.UnsortCCId,
                            unSortCcData.InstId,
                            unSortCcData.DenoId);

                return transactionContainerPrepare;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}