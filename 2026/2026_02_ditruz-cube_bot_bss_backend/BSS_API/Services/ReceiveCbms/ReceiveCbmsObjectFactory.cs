namespace BSS_API.Services.ReceiveCbms
{
    using Interface;
    using Core.Constants;
    using Models.Entities;
    using Models.ModelHelper;
    using Models.RequestModels;
    using System.Globalization;
    using Core.CustomException;
    using Models.External.Request;
    using Models.External.Response;
    using BSS_API.Repositories.Interface;

    public interface IReceiveCbmsObjectFactory
    {
        Task<ConvertToReceiveCbmsDataTransactionResponse> ConvertToReceiveCbmsDataTransaction(
            ReceiveCbmsDataRequest receiveCbmsRequestData);
    }

    public class ReceiveCbmsObjectFactory(IUnitOfWork? unitOfWork) : IReceiveCbmsObjectFactory
    {
        private const string _defaultQty = "5";

        private readonly IBarcodeService? _barcodeService;

        private readonly IUnitOfWork _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));

        public async Task<ConvertToReceiveCbmsDataTransactionResponse> ConvertToReceiveCbmsDataTransaction(
            ReceiveCbmsDataRequest receiveCbmsRequestData)
        {
            ConvertToReceiveCbmsDataTransactionResponse convertReceiveCbmsDataTransactionResponse =
                new ConvertToReceiveCbmsDataTransactionResponse();

            if (receiveCbmsRequestData.ReceivedData.Count > 0)
            {
                bool isSingleBnTypeInputCode = receiveCbmsRequestData.ReceivedData
                    .Select(x => x.bn_type_input)
                    .Where(x => !string.IsNullOrWhiteSpace(x))
                    .Distinct()
                    .Count() == 1;

                if (!isSingleBnTypeInputCode)
                {
                    throw new ImportCbmsParameterException(
                        ImportCbmsResponseMessageConstants.FailedWithExceptionMessage);
                }

                convertReceiveCbmsDataTransactionResponse.BnTypeInput = receiveCbmsRequestData.ReceivedData
                    .FirstOrDefault(x => !string.IsNullOrWhiteSpace(x.bn_type_input))?.bn_type_input;

                if (string.IsNullOrEmpty(convertReceiveCbmsDataTransactionResponse.BnTypeInput) ||
                    (convertReceiveCbmsDataTransactionResponse.BnTypeInput != BNTypeInputConstants.Unfit &&
                     convertReceiveCbmsDataTransactionResponse.BnTypeInput != BNTypeInputConstants.UnSort))
                {
                    throw new ImportCbmsParameterException(
                        string.Format(ImportCbmsResponseMessageConstants.ParameterIsMissing, "bn_type_input"));
                }

                var bssWorkDayConfigs =
                    (await _unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync(ConfigConstants.BSS_DAY));

                if (bssWorkDayConfigs.Count == 0)
                {
                    throw new ImportCbmsErrorException(ImportCbmsResponseMessageConstants.FailedWithExceptionMessage);
                }

                DateTime startDate = bssWorkDayConfigs.ToBssWorkDayStartDateTime();
                DateTime endDate = bssWorkDayConfigs.ToBssWorkDayEndDateTime();

                #region PreparationUnfit

                if (convertReceiveCbmsDataTransactionResponse.BnTypeInput == BNTypeInputConstants.Unfit)
                {
                    foreach (var receiveData in receiveCbmsRequestData.ReceivedData)
                    {
                        #region ValidateImportCbmsParameter

                        ValidateImportCbmsParameterIsRequire(receiveData, BNTypeInputConstants.Unfit);
                        ValidateImportCbmsParameterMaximumLimit(receiveData, BNTypeInputConstants.Unfit);

                        #endregion ValidateImportCbmsParameter

                        #region MasterInstitution

                        // Todo หลักที่ 1-3 เป็น รหัสธนาคาร เช่น 001 
                        var institutionCode = receiveData.barcode.Substring(0, 3);
                        var masterInstitution =
                            await _unitOfWork.InstitutionRepos.GetMasterInstitutionByCodeAsync(institutionCode);
                        if (masterInstitution == null)
                        {
                            throw new ImportCbmsParameterException(string.Format(
                                ImportCbmsResponseMessageConstants.ParameterNotFoundInMasterData, "INST_CODE",
                                institutionCode));
                        }

                        #endregion MasterInstitution

                        #region MasterDenomination

                        // Todo หลักที่ 8 เป็น ชนิดราคา
                        var denominationCode = int.Parse(receiveData.barcode[7].ToString());
                        var masterDenomination =
                            await _unitOfWork.DenominationRepos.GetAsync(
                                w => w.DenominationCode == denominationCode && w.IsActive == true,
                                tracked: false);

                        if (masterDenomination == null)
                        {
                            throw new ImportCbmsParameterException(
                                string.Format(ImportCbmsResponseMessageConstants.ParameterNotFoundInMasterData, "DENO",
                                    denominationCode));
                        }

                        #endregion MasterDenomination

                        #region MasterDepartment

                        var masterDepartment =
                            await _unitOfWork.DepartmentRepos.GetAsync(
                                w => w.DepartmentShortName == receiveData.bdc_code && w.IsActive == true,
                                tracked: false);

                        if (masterDepartment == null)
                        {
                            throw new ImportCbmsParameterException(string.Format(
                                ImportCbmsResponseMessageConstants.ParameterNotFoundInMasterData, "BDC_CODE",
                                receiveData.bdc_code));
                        }

                        convertReceiveCbmsDataTransactionResponse.DepartmentId = masterDepartment.DepartmentId;

                        #endregion MasterDepartment

                        #region ValidateBarcode

                        await ValidateImportCbmsParameterFormatAsync(receiveData, BNTypeInputConstants.Unfit,
                            departmentId: masterDepartment.DepartmentId);

                        #endregion ValidateBarcode

                        #region CheckDuplicateWithRegisterUnsort

                        await CheckDuplicateInRegisterUnSortAsync(receiveData.container_id,
                            masterDepartment.DepartmentId, startDate, endDate);

                        #endregion CheckDuplicateWithRegisterUnsort

                        MasterConfig? unfitQtyConfig =
                            await _unitOfWork.ConfigRepos.GetAsync(
                                w => w.ConfigCode == ConfigConstants.UNFIT_QTY && w.IsActive == true,
                                tracked: false);

                        if (unfitQtyConfig == null)
                        {
                            throw new ImportCbmsErrorException(ImportCbmsResponseMessageConstants
                                .FailedWithExceptionMessage);
                        }

                        ReceiveCbmsDataTransaction receiveCbmsDataTransaction = new ReceiveCbmsDataTransaction
                        {
                            DepartmentId = masterDepartment.DepartmentId,
                            BnTypeInput = BNTypeInputConstants.Unfit,
                            BarCode = receiveData.barcode,
                            ContainerId = receiveData.container_id,
                            SendDate = receiveData.send_date,
                            InstitutionId = masterInstitution.InstitutionId,
                            DenominationId = masterDenomination.DenominationId,
                            CbBdcCode = receiveData.cb_bdc_code,
                            CreatedBy = receiveData.requested_by,
                            CreatedDate = DateTime.Now,

                            Qty = null,
                            RemainingQty = int.Parse(unfitQtyConfig?.ConfigValue ?? _defaultQty),
                            UnfitQty = int.Parse(unfitQtyConfig?.ConfigValue ?? _defaultQty),
                        };

                        #region CheckCbmsDuplicate

                        var existingCbms = await _unitOfWork.CbmsTransactionRepos
                            .GetTransactionContainerPrepareForImportCbmsIdAsync(receiveCbmsDataTransaction.ContainerId,
                                receiveCbmsDataTransaction.DepartmentId, receiveCbmsDataTransaction.InstitutionId,
                                receiveCbmsDataTransaction.DenominationId, startDate, endDate,
                                barcode: receiveCbmsDataTransaction.BarCode);

                        if (existingCbms != null)
                        {
                            convertReceiveCbmsDataTransactionResponse.ReceiveCbmsDataTransactionDuplicate.Add(
                                new ReceiveCbmsDataTransactionDuplicate
                                {
                                    OldReceiveCbms = existingCbms,
                                    NewReceiveCbms = receiveCbmsDataTransaction,
                                });
                        }
                        else
                        {
                            // Todo case insert
                            convertReceiveCbmsDataTransactionResponse.ReceiveCbmsDataTransactionNew.Add(
                                receiveCbmsDataTransaction);
                        }

                        #endregion CheckCbmsDuplicate
                    }
                }

                #endregion PreparationUnfit

                #region PrepareationUnsortCA

                else if (convertReceiveCbmsDataTransactionResponse.BnTypeInput == BNTypeInputConstants.UnSort)
                {
                    foreach (var receiveData in receiveCbmsRequestData.ReceivedData)
                    {
                        #region ValidateImportCbmsParameter

                        ValidateImportCbmsParameterIsRequire(receiveData, BNTypeInputConstants.UnSort);

                        bool isCAMember = receiveData.cb_bdc_code.StartsWith("4");
                        ValidateImportCbmsParameterMaximumLimit(receiveData, BNTypeInputConstants.UnSort);

                        #endregion ValidateImportCbmsParameter

                        #region MasterDepartment

                        var masterDepartment =
                            await _unitOfWork.DepartmentRepos.GetAsync(
                                w => w.DepartmentShortName == receiveData.bdc_code && w.IsActive == true,
                                tracked: false);

                        if (masterDepartment == null)
                        {
                            throw new ImportCbmsParameterException(string.Format(
                                ImportCbmsResponseMessageConstants.ParameterNotFoundInMasterData, "BDC_CODE",
                                receiveData.bdc_code));
                        }

                        convertReceiveCbmsDataTransactionResponse.DepartmentId = masterDepartment.DepartmentId;

                        #endregion MasterDepartment

                        #region ValidateBarcode

                        await ValidateImportCbmsParameterFormatAsync(receiveData, BNTypeInputConstants.UnSort,
                            departmentId: masterDepartment.DepartmentId);

                        #endregion ValidateBarcode

                        #region MasterInstitution

                        var masterInstitution =
                            await _unitOfWork.InstitutionRepos.GetMasterInstitutionByCodeAsync(receiveData
                                .inst_code ?? string.Empty);

                        if (masterInstitution == null)
                        {
                            throw new ImportCbmsParameterException(string.Format(
                                ImportCbmsResponseMessageConstants.ParameterNotFoundInMasterData, "INST_CODE",
                                receiveData.inst_code));
                        }

                        #endregion MasterInstitution

                        #region CheckTypeCAMember

                        if (isCAMember)
                        {
                            // Todo cb_bdc_code ขึ้นต้นด้วย 4 จะเป็น CA Member ( ต้องมี company department ในระบบ )
                            var companyDepartment = await _unitOfWork.CompanyDepartmentRepos.GetAsync(w =>
                                    w.CbBcdCode == receiveData.cb_bdc_code && w.IsActive == true,
                                tracked: false);

                            if (companyDepartment == null)
                            {
                                throw new ImportCbmsParameterException(string.Format(
                                    ImportCbmsResponseMessageConstants.ParameterNotFoundInMasterData,
                                    "CB_BDC_CODE", receiveData.cb_bdc_code));
                            }

                            // Todo ไม่ต้อง validate cash center เพราะ CA member จะมีโซนและสาขา
                        }
                        else
                        {
                            // Todo cb_bdc_code ไม่ขึ้นต้นด้วย 4 จะเป็น CA Non Member
                            // Todo validate cash center ต้องมีใน institution

                            #region ValidateCashCenterWithInstitution

                            var masterCashCenter = await _unitOfWork.CashCenterRepos.GetAsync(w =>
                                w.CashCenterCode == receiveData.cb_bdc_code &&
                                w.IsActive == true, tracked: false);

                            if (masterCashCenter == null)
                            {
                                throw new ImportCbmsParameterException(string.Format(
                                    ImportCbmsResponseMessageConstants.ParameterNotFoundInMasterData, "CB_BDC_CODE",
                                    receiveData.cb_bdc_code));
                            }

                            if (masterCashCenter.InstitutionId != masterInstitution.InstitutionId)
                            {
                                throw new ImportCbmsParameterException(
                                    string.Format(
                                        ImportCbmsResponseMessageConstants.ParameterCashCenterNotFoundInInstitution,
                                        masterInstitution.BankCode, masterCashCenter.CashCenterCode));
                            }

                            #endregion ValidateCashCenterWithInstitution
                        }

                        #endregion CheckTypeCAMember

                        #region MasterDenomination

                        var masterDenomination =
                            await _unitOfWork.DenominationRepos.GetAsync(
                                w => w.DenominationPrice == receiveData.deno.Value && w.IsActive == true,
                                tracked: false);

                        if (masterDenomination == null)
                        {
                            throw new ImportCbmsParameterException(string.Format(
                                ImportCbmsResponseMessageConstants.ParameterNotFoundInMasterData, "DENO",
                                receiveData.deno.Value));
                        }

                        #endregion MasterDenomination

                        #region CheckDuplicateWithRegisterUnsort

                        await CheckDuplicateInRegisterUnSortAsync(receiveData.container_id,
                            masterDepartment.DepartmentId, startDate, endDate);

                        #endregion CheckDuplicateWithRegisterUnsort

                        ReceiveCbmsDataTransaction receiveCbmsDataTransaction = new ReceiveCbmsDataTransaction
                        {
                            DepartmentId = masterDepartment.DepartmentId,
                            BnTypeInput = BNTypeInputConstants.UnSort,
                            ContainerId = receiveData.container_id,
                            SendDate = receiveData.send_date,
                            InstitutionId = masterInstitution.InstitutionId,
                            DenominationId = masterDenomination.DenominationId,
                            CbBdcCode = receiveData.cb_bdc_code,
                            CreatedBy = receiveData.requested_by,
                            CreatedDate = DateTime.Now,

                            Qty = receiveData.qty,
                            RemainingQty = receiveData.qty,
                            UnfitQty = null,
                        };

                        #region CheckCbmsDuplicate

                        var existingCbms = await _unitOfWork.CbmsTransactionRepos
                            .GetTransactionContainerPrepareForImportCbmsIdAsync(receiveCbmsDataTransaction.ContainerId,
                                receiveCbmsDataTransaction.DepartmentId, receiveCbmsDataTransaction.InstitutionId,
                                receiveCbmsDataTransaction.DenominationId, startDate, endDate);

                        if (existingCbms != null)
                        {
                            convertReceiveCbmsDataTransactionResponse.ReceiveCbmsDataTransactionDuplicate.Add(
                                new ReceiveCbmsDataTransactionDuplicate
                                {
                                    OldReceiveCbms = existingCbms,
                                    NewReceiveCbms = receiveCbmsDataTransaction
                                });
                        }
                        else
                        {
                            // Todo case insert
                            convertReceiveCbmsDataTransactionResponse.ReceiveCbmsDataTransactionNew.Add(
                                receiveCbmsDataTransaction);
                        }

                        #endregion CheckCbmsDuplicate
                    }
                }

                #endregion PrepareationUnsortCA
            }

            return convertReceiveCbmsDataTransactionResponse;
        }

        private async Task CheckDuplicateInRegisterUnSortAsync(string containerId, int departmentId, DateTime startDate,
            DateTime endDate)
        {
            try
            {
                List<int> notInStatus =
                [
                    BssStatusConstants.Finished,
                    BssStatusConstants.DeletedPrePrepare
                ];

                if (await _unitOfWork.TransactionRegisterUnsortRepos.ImportCbmsCheckDuplicateInRegisterUnSortAsync(
                        containerId, departmentId, startDate, endDate, notInStatus) != null)
                {
                    throw new ImportCbmsErrorException(
                        string.Format(ImportCbmsResponseMessageConstants.RegisteredInRegisterUnSort,
                            containerId));
                }
            }
            catch (Exception)
            {
                throw new ImportCbmsErrorException(ImportCbmsResponseMessageConstants.Failed);
            }
        }

        private void ValidateImportCbmsParameterIsRequire(ReceiveCbmsReceiveData receiveData, string bnTypeInputCode)
        {
            if (string.IsNullOrEmpty(receiveData.bdc_code))
            {
                throw new ImportCbmsParameterException(
                    string.Format(ImportCbmsResponseMessageConstants.ParameterIsMissing, "bdc_code"));
            }

            if (string.IsNullOrEmpty(receiveData.bn_type_input))
            {
                throw new ImportCbmsParameterException(
                    string.Format(ImportCbmsResponseMessageConstants.ParameterIsMissing, "bn_type_input"));
            }

            if (string.IsNullOrEmpty(receiveData.container_id))
            {
                throw new ImportCbmsParameterException(
                    string.Format(ImportCbmsResponseMessageConstants.ParameterIsMissing, "container_id"));
            }

            if (!receiveData.send_date.HasValue)
            {
                throw new ImportCbmsParameterException(
                    string.Format(ImportCbmsResponseMessageConstants.ParameterIsMissing, "send_date"));
            }

            if (string.IsNullOrEmpty(receiveData.requested_by))
            {
                throw new ImportCbmsParameterException(
                    string.Format(ImportCbmsResponseMessageConstants.ParameterIsMissing, "requested_by"));
            }

            if (bnTypeInputCode == BNTypeInputConstants.Unfit)
            {
                if (string.IsNullOrEmpty(receiveData.barcode))
                {
                    throw new ImportCbmsParameterException(
                        string.Format(ImportCbmsResponseMessageConstants.ParameterIsMissing, "barcode"));
                }
            }
            else if (bnTypeInputCode == BNTypeInputConstants.UnSort)
            {
                if (string.IsNullOrEmpty(receiveData.cb_bdc_code))
                {
                    throw new ImportCbmsParameterException(
                        string.Format(ImportCbmsResponseMessageConstants.ParameterIsMissing, "cb_bcd_code"));
                }

                if (!receiveData.deno.HasValue)
                {
                    throw new ImportCbmsParameterException(
                        string.Format(ImportCbmsResponseMessageConstants.ParameterIsMissing, "deno"));
                }

                if (string.IsNullOrEmpty(receiveData.inst_code))
                {
                    throw new ImportCbmsParameterException(
                        string.Format(ImportCbmsResponseMessageConstants.ParameterIsMissing, "inst_code"));
                }

                if (!receiveData.qty.HasValue)
                {
                    throw new ImportCbmsParameterException(
                        string.Format(ImportCbmsResponseMessageConstants.ParameterIsMissing, "qty"));
                }
            }
        }

        private void ValidateImportCbmsParameterMaximumLimit(ReceiveCbmsReceiveData receiveData, string bnTypeInputCode)
        {
            if (receiveData.bdc_code?.Length > ImportCbmsParameterLengthConstants.bdc_code_length)
            {
                throw new ImportCbmsParameterException(
                    string.Format(ImportCbmsResponseMessageConstants.ParameterMaximumLimit, "bdc_code"));
            }

            if (receiveData.bn_type_input?.Length > ImportCbmsParameterLengthConstants.bn_type_input_length)
            {
                throw new ImportCbmsParameterException(
                    string.Format(ImportCbmsResponseMessageConstants.ParameterMaximumLimit, "bn_type_input"));
            }

            if (receiveData.container_id?.Length > ImportCbmsParameterLengthConstants.container_id_length)
            {
                throw new ImportCbmsParameterException(
                    string.Format(ImportCbmsResponseMessageConstants.ParameterMaximumLimit, "container_id"));
            }

            if (receiveData.send_date != null &&
                receiveData.send_date.Value.ToString(CultureInfo.InvariantCulture).Length >
                ImportCbmsParameterLengthConstants.send_date_length)
            {
                throw new ImportCbmsParameterException(
                    string.Format(ImportCbmsResponseMessageConstants.ParameterMaximumLimit, "send_date"));
            }

            if (receiveData.requested_by?.Length > ImportCbmsParameterLengthConstants.requested_by_length)
            {
                throw new ImportCbmsParameterException(
                    string.Format(ImportCbmsResponseMessageConstants.ParameterMaximumLimit, "requested_by"));
            }

            if (bnTypeInputCode == BNTypeInputConstants.Unfit)
            {
                if (receiveData.barcode?.Length > ImportCbmsParameterLengthConstants.barcode_length)
                {
                    throw new ImportCbmsParameterException(
                        string.Format(ImportCbmsResponseMessageConstants.ParameterMaximumLimit, "barcode"));
                }
            }
            else if (bnTypeInputCode == BNTypeInputConstants.UnSort)
            {
                if (receiveData.cb_bdc_code?.Length > ImportCbmsParameterLengthConstants.cb_bdc_code_length)
                {
                    throw new ImportCbmsParameterException(
                        string.Format(ImportCbmsResponseMessageConstants.ParameterMaximumLimit, "cb_bcd_code"));
                }

                if (receiveData.deno.HasValue)
                {
                    if (receiveData.deno.ToString()?.Contains(".") == true)
                    {
                        var qtyStrings = receiveData.deno.ToString()?.Split(".");
                        if (qtyStrings?[0].Length > ImportCbmsParameterLengthConstants.deno_prefix_length ||
                            qtyStrings?[1].Length > ImportCbmsParameterLengthConstants.deno_subfix_length)
                        {
                            throw new ImportCbmsParameterException(
                                string.Format(ImportCbmsResponseMessageConstants.ParameterMaximumLimit, "deno"));
                        }
                    }
                    else
                    {
                        var qtyString = receiveData.deno.ToString();
                        if (qtyString?.Length > ImportCbmsParameterLengthConstants.deno_prefix_length)
                        {
                            throw new ImportCbmsParameterException(
                                string.Format(ImportCbmsResponseMessageConstants.ParameterMaximumLimit, "deno"));
                        }
                    }
                }

                if (receiveData.inst_code?.Length > ImportCbmsParameterLengthConstants.inst_code_length)
                {
                    throw new ImportCbmsParameterException(
                        string.Format(ImportCbmsResponseMessageConstants.ParameterMaximumLimit, "inst_code"));
                }

                if (receiveData.qty.HasValue)
                {
                    if (receiveData.qty.Value < 0)
                    {
                        throw new ImportCbmsParameterException(ImportCbmsResponseMessageConstants
                            .QtyParameterLessThenZero);
                    }

                    var qtyString = receiveData.qty.ToString();
                    if (qtyString?.Length > ImportCbmsParameterLengthConstants.qty_length)
                    {
                        throw new ImportCbmsParameterException(
                            string.Format(ImportCbmsResponseMessageConstants.ParameterMaximumLimit, "qty"));
                    }
                }
            }
        }

        private async Task ValidateImportCbmsParameterFormatAsync(ReceiveCbmsReceiveData receiveData,
            string bnTypeInputCode, int? departmentId = null, bool isCAMember = false)
        {
            BarcodeService.ValidateBarcodeServiceBuilder validateBarcodeBuilder =
                new BarcodeService.ValidateBarcodeServiceBuilder();

            // Todo validate barcode container
            string bnTypeInput = string.Empty;
            if (bnTypeInputCode == BNTypeInputConstants.Unfit)
            {
                bnTypeInput = BssBNTypeCodeConstants.Unfit;
            }
            else if (bnTypeInputCode == BNTypeInputConstants.UnSort)
            {
                if (isCAMember)
                {
                    bnTypeInput = BssBNTypeCodeConstants.UnsortCAMember;
                }
                else
                {
                    bnTypeInput = BssBNTypeCodeConstants.UnsortCANonMember;
                }
            }

            ValidateBarcodeRequest validateBarcodeContainerRequest = new ValidateBarcodeRequest
            {
                DepartmentId = departmentId,
                ValidateBarcodeType = BarcodeTypeConstants.BarcodeContainer,
                BssBNTypeCode = bnTypeInput,
                ValidateExistingInDatabase = false,
                ValidateBarcodeItem = new List<ValidateBarcodeItem>
                {
                    new()
                    {
                        BarcodeType = BarcodeTypeConstants.BarcodeContainer,
                        BarcodeValue = receiveData.container_id ?? string.Empty
                    }
                }
            };

            validateBarcodeBuilder.SetUnitOfWork(_unitOfWork);
            validateBarcodeBuilder.SetValidateBarcodeRequest(validateBarcodeContainerRequest);
            BarcodeService barcodeService = validateBarcodeBuilder.Build();

            var validateContainerResult = await barcodeService.ValidateAsync();

            if (!validateContainerResult.IsValid)
            {
                throw new ImportCbmsParameterException(string.Format(
                    ImportCbmsResponseMessageConstants.ParameterInvalidFormat,
                    receiveData.container_id ?? string.Empty, "XXXXXXX"));
            }

            if (bnTypeInputCode == BNTypeInputConstants.Unfit)
            {
                ValidateBarcodeRequest validateBarcodeWrapRequest = new ValidateBarcodeRequest
                {
                    DepartmentId = departmentId,
                    ValidateBarcodeType = BarcodeTypeConstants.BarcodeWrap,
                    BssBNTypeCode = BssBNTypeCodeConstants.Unfit,
                    ValidateExistingInDatabase = false,
                    ValidateBarcodeItem = new List<ValidateBarcodeItem>
                    {
                        new()
                        {
                            BarcodeType = BarcodeTypeConstants.BarcodeContainer,
                            BarcodeValue = receiveData.container_id ?? string.Empty
                        },
                        new()
                        {
                            BarcodeType = BarcodeTypeConstants.BarcodeWrap,
                            BarcodeValue = receiveData.barcode ?? string.Empty
                        }
                    }
                };

                validateBarcodeBuilder.SetValidateBarcodeRequest(validateBarcodeWrapRequest);
                validateBarcodeBuilder.SetUnitOfWork(_unitOfWork);
                var validateBarCodeWrapResult = await barcodeService.ValidateAsync();

                if (!validateBarCodeWrapResult.IsValid)
                {
                    throw new ImportCbmsParameterException(string.Format(
                        ImportCbmsResponseMessageConstants.ParameterInvalidFormat,
                        receiveData.barcode ?? string.Empty, "XXXXXXXXXXXXXXXXXX"));
                }
            }
        }
    }
}