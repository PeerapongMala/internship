namespace BSS_API.Services
{
    using Helpers;
    using Interface;
    using Core.Constants;
    using Models.Entities;
    using Models.ModelHelper;
    using Models.RequestModels;
    using Models.ResponseModels;
    using Org.BouncyCastle.Security;
    using System.Text.RegularExpressions;
    using BSS_API.Repositories.Interface;

    public class BarcodeService : IBarcodeService
    {
        private int? _companyId;

        private int? _departmentId;

        private IUnitOfWork _unitOfWork;

        private ValidateBarcodeRequest? _validateBarcodeRequest;

        private TransactionPreparation? _transactionPreparation;

        private TransactionContainerPrepare? _transactionContainerPrepare;

        private ReceiveCbmsDataTransaction? _receiveCbmsDataTransaction;

        public BarcodeService()
        {
        }

        public async Task<ValidateBarcodeResponse?> ValidateAsync()
        {
            ValidateBarcodeResponse? validateBarcodeResponse;
            switch (_validateBarcodeRequest?.ValidateBarcodeType)
            {
                case BarcodeTypeConstants.BarcodeContainer:
                    validateBarcodeResponse = await ValidateBarcodeContainerAsync(_validateBarcodeRequest);
                    break;
                case BarcodeTypeConstants.BarcodeWrap:
                    validateBarcodeResponse = await ValidateBarcodeWrapAsync(_validateBarcodeRequest);
                    break;
                case BarcodeTypeConstants.BarcodeBundle:
                    validateBarcodeResponse = await ValidateBarcodeBundleAsync(_validateBarcodeRequest);
                    break;
                case BarcodeTypeConstants.HeaderCard:
                    validateBarcodeResponse = await ValidateHeaderCardAsync(_validateBarcodeRequest);
                    break;
                default:
                    throw new ArgumentOutOfRangeException(ValidateBarcodeErrorMessage.ValidateTypeParameterInvalid);
            }

            return validateBarcodeResponse;
        }

        public async Task<string> GenerateDummyBarcodeBundle()
        {
            if (_receiveCbmsDataTransaction == null) return string.Empty;

            try
            {
                string prefix = _receiveCbmsDataTransaction.BarCode.Substring(0, 8);
                string middle = "9999999999999";

                var latestBundleBarcode = await _unitOfWork.TransactionPreparationRepos
                    .CheckLatestBundleBarcodeAsync(_receiveCbmsDataTransaction.ReceiveId);

                int suffix = latestBundleBarcode != null
                    ? int.Parse(latestBundleBarcode.BundleCode.Substring(latestBundleBarcode.BundleCode.Length - 3)) - 1
                    : 999;

                return $"{prefix}{middle}{suffix}";
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }

        public async Task GenerateBarcodeAsync(BNType bnType, bool isGenerateBarcodeWrap = true,
            bool isValidateAfterGenerate = false)
        {
            MasterInstitution? masterInstitution;
            MasterCashType? masterCashType;
            MasterCashCenter? masterCashCenter;
            MasterZone? masterZone;
            MasterCashPoint? masterCashPoint;
            MasterDenomination? masterDenomination;

            MasterCompanyDepartment? masterCompanyDepartment;

            if (_transactionPreparation == null)
            {
                throw new ArgumentNullException(nameof(_transactionPreparation));
            }


            masterCompanyDepartment = await _unitOfWork.CompanyDepartmentRepos.GetAsync(w =>
                w.CompanyId == _companyId && w.DepartmentId == _departmentId && w.IsActive == true);

            if (masterCompanyDepartment == null)
            {
                throw new InvalidParameterException(
                    "generate barcode fail. master company department not found.");
            }

            try
            {
                switch (bnType)
                {
                    case BNType.Unfit:
                        // Todo preparation unfit ไม่มี generate barcode


                        break;
                    case BNType.UnsortCANonMember:

                        masterInstitution = await _unitOfWork.InstitutionRepos.GetAsync(w =>
                            w.InstitutionId == _transactionPreparation.InstId && w.IsActive == true);
                        masterCashCenter = await _unitOfWork.CashCenterRepos.GetAsync(w =>
                            w.CashCenterId == _transactionPreparation.CashcenterId && w.IsActive == true);
                        masterCashType = await _unitOfWork.CashtypeRepos.GetAsync(w =>
                            w.CashTypeId == CashTypeConstants.UnsortCA &&
                            w.IsActive == true);
                        masterDenomination = await _unitOfWork.DenominationRepos.GetAsync(w =>
                            w.DenominationId == _transactionPreparation.DenoId &&
                            w.IsActive == true);

                        if (masterInstitution == null || masterCashCenter == null || masterCashType == null ||
                            masterDenomination == null)
                        {
                            throw new InvalidParameterException(
                                "generate barcode fail. master data parameter not found.");
                        }

                        #region GenerateWrapBarcode

                        if (isGenerateBarcodeWrap)
                        {
                            string unsortCANonMemberBarcodeWrap =
                                $"{BssBNTypeCodeConstants.UnsortCANonMember}_{BarcodeTypeConstants.BarcodeWrap}";

                            BssTransactionContainerSequence? unsortCANonMemberBarcodeWrapSequence =
                                await _unitOfWork.BssTransactionContainerSequenceRepos
                                    .GetBssTransactionContainerSequenceByTypeParameterAsync(
                                        unsortCANonMemberBarcodeWrap,
                                        _departmentId.Value, masterInstitution.InstitutionId,
                                        masterDenomination.DenominationId,
                                        cashCenterId: masterCashCenter.CashCenterId) ??
                                new BssTransactionContainerSequence
                                {
                                    DepartmentId = _departmentId.Value,
                                    InstitutionId = masterInstitution.InstitutionId,
                                    CashCenterId = masterCashCenter.CashCenterId,
                                    DenominationId = masterDenomination.DenominationId,
                                    ContainerType = unsortCANonMemberBarcodeWrap,
                                    SequenceNo = 0,
                                    IsActive = true,
                                };

                            // Todo ถ้าไม่มี seq running set 1 และ insert
                            unsortCANonMemberBarcodeWrapSequence.SequenceNo += 1;
                            if (unsortCANonMemberBarcodeWrapSequence.CreatedDate == null)
                            {
                                unsortCANonMemberBarcodeWrapSequence.CreatedDate = DateTime.Today;
                                unsortCANonMemberBarcodeWrapSequence.CreatedBy = _transactionPreparation.UpdatedBy;
                                await _unitOfWork.BssTransactionContainerSequenceRepos.AddAsync(
                                    unsortCANonMemberBarcodeWrapSequence);
                            }
                            else
                            {
                                unsortCANonMemberBarcodeWrapSequence.UpdatedDate = DateTime.Today;
                                unsortCANonMemberBarcodeWrapSequence.UpdatedBy = _transactionPreparation.UpdatedBy;
                            }

                            //_transactionPreparation.PackageCode = GenerateBarcodeWrap(masterInstitution,
                            //    masterCompanyDepartment,
                            //    masterCashType, masterDenomination, _transactionPreparation.PrepareDate,
                            //    unsortCANonMemberBarcodeWrapSequence.SequenceNo.Value);

                            _transactionPreparation.PackageCode = GenerateBarcodeWrapForCaNonMember(masterInstitution,
                                masterCashCenter,
                                masterCashType, masterDenomination, _transactionPreparation.PrepareDate,
                                unsortCANonMemberBarcodeWrapSequence.SequenceNo.Value);
                        }

                        // Todo validate format before next step
                        if (isValidateAfterGenerate)
                        {
                            ValidateBarcodeRequest unsortCANonMemberBarcodeWrapValidateRequest =
                                new ValidateBarcodeRequest
                                {
                                    ValidateBarcodeType = BarcodeTypeConstants.BarcodeWrap,
                                    BssBNTypeCode = BssBNTypeCodeConstants.UnsortCANonMember,
                                    ValidateBarcodeItem = new List<ValidateBarcodeItem>
                                    {
                                        new()
                                        {
                                            BarcodeType = BarcodeTypeConstants.BarcodeWrap,
                                            BarcodeValue = _transactionPreparation.PackageCode
                                        }
                                    }
                                };

                            var unsortCANonMemberBarcodeWrapValidateResult =
                                await ValidateBarcodeWrapAsync(unsortCANonMemberBarcodeWrapValidateRequest);
                            if (!unsortCANonMemberBarcodeWrapValidateResult.IsValid)
                            {
                                throw new Exception(unsortCANonMemberBarcodeWrapValidateResult.ErrorMessage);
                            }
                        }

                        #endregion GenerateWrapBarcode

                        #region GenerateBundleBarcode

                        string unsortCANonMemberBarcodeBundle =
                            $"{BssBNTypeCodeConstants.UnsortCANonMember}_{BarcodeTypeConstants.BarcodeBundle}";
                        BssTransactionContainerSequence? unsortCANonMemberBarcodeBundleSequence =
                            await _unitOfWork.BssTransactionContainerSequenceRepos
                                .GetBssTransactionContainerSequenceByTypeParameterAsync(unsortCANonMemberBarcodeBundle,
                                    _departmentId.Value, masterInstitution.InstitutionId,
                                    masterDenomination.DenominationId,
                                    cashCenterId: masterCashCenter.CashCenterId) ?? new BssTransactionContainerSequence
                            {
                                DepartmentId = _departmentId.Value,
                                InstitutionId = masterInstitution.InstitutionId,
                                CashCenterId = masterCashCenter.CashCenterId,
                                DenominationId = masterDenomination.DenominationId,
                                ContainerType = unsortCANonMemberBarcodeBundle,
                                SequenceNo = 0,
                                IsActive = true,
                            };

                        // Todo ถ้าไม่มี seq running set 1 และ insert
                        unsortCANonMemberBarcodeBundleSequence.SequenceNo += 1;
                        if (unsortCANonMemberBarcodeBundleSequence.CreatedDate == null)
                        {
                            unsortCANonMemberBarcodeBundleSequence.CreatedDate = DateTime.Today;
                            unsortCANonMemberBarcodeBundleSequence.CreatedBy = _transactionPreparation.UpdatedBy;
                            await _unitOfWork.BssTransactionContainerSequenceRepos.AddAsync(
                                unsortCANonMemberBarcodeBundleSequence);
                        }
                        else
                        {
                            unsortCANonMemberBarcodeBundleSequence.UpdatedDate = DateTime.Today;
                            unsortCANonMemberBarcodeBundleSequence.UpdatedBy = _transactionPreparation.UpdatedBy;
                        }

                        string unsortCANonMemberBundleCode = GenerateBarcodeBundle(_transactionPreparation.PackageCode,
                            unsortCANonMemberBarcodeBundleSequence.SequenceNo.Value);

                        // Todo validate format before end process
                        if (isValidateAfterGenerate)
                        {
                            ValidateBarcodeRequest unsortCANonMemberBarcodeBundleValidateRequest =
                                new ValidateBarcodeRequest
                                {
                                    ValidateBarcodeType = BarcodeTypeConstants.BarcodeBundle,
                                    ValidateBarcodeItem = new List<ValidateBarcodeItem>
                                    {
                                        new()
                                        {
                                            BarcodeType = BarcodeTypeConstants.BarcodeWrap,
                                            BarcodeValue = _transactionPreparation.PackageCode
                                        },
                                        new()
                                        {
                                            BarcodeType = BarcodeTypeConstants.BarcodeBundle,
                                            BarcodeValue = unsortCANonMemberBundleCode
                                        }
                                    }
                                };

                            var unsortCANonMemberBarcodeBundleValidateResult =
                                await ValidateBarcodeBundleAsync(unsortCANonMemberBarcodeBundleValidateRequest);
                            if (!unsortCANonMemberBarcodeBundleValidateResult.IsValid)
                            {
                                throw new Exception(unsortCANonMemberBarcodeBundleValidateResult.ErrorMessage);
                            }
                        }

                        _transactionPreparation.BundleCode = unsortCANonMemberBundleCode;

                        #endregion GenerateBundleBarcode

                        break;
                    case BNType.UnsortCAMember:

                        masterInstitution = await _unitOfWork.InstitutionRepos.GetAsync(w =>
                            w.InstitutionId == _transactionPreparation.InstId && w.IsActive == true);
                        masterZone = await _unitOfWork.ZoneRepos.GetAsync(w =>
                            w.ZoneId == _transactionPreparation.ZoneId && w.IsActive == true);
                        masterCashType = await _unitOfWork.CashtypeRepos.GetAsync(w =>
                            w.CashTypeId == CashTypeConstants.UnsortCA &&
                            w.IsActive == true);
                        masterCashPoint = await _unitOfWork.CashPointRepos.GetAsync(w =>
                            w.CashpointId == _transactionPreparation.CashpointId && w.IsActive == true);
                        masterDenomination = await _unitOfWork.DenominationRepos.GetAsync(w =>
                            w.DenominationId == _transactionPreparation.DenoId &&
                            w.IsActive == true);

                        if (masterInstitution == null || masterZone == null || masterCashType == null
                            || masterCashPoint == null || masterDenomination == null)
                        {
                            throw new InvalidParameterException(
                                "generate barcode fail. master data parameter not found.");
                        }

                        #region GenerateWrapBarcode

                        if (isGenerateBarcodeWrap)
                        {
                            string UnsortCAMemberBarcodeWrap =
                                $"{BssBNTypeCodeConstants.UnsortCAMember}_{BarcodeTypeConstants.BarcodeWrap}";
                            BssTransactionContainerSequence? unsortCAMemberBarcodeWrapSequence =
                                await _unitOfWork.BssTransactionContainerSequenceRepos
                                    .GetBssTransactionContainerSequenceByTypeParameterAsync(UnsortCAMemberBarcodeWrap,
                                        _departmentId.Value, masterInstitution.InstitutionId,
                                        masterDenomination.DenominationId,
                                        zoneId: masterZone.ZoneId, cashPointId: masterCashPoint.CashpointId) ??
                                new BssTransactionContainerSequence
                                {
                                    DepartmentId = _departmentId.Value,
                                    InstitutionId = masterInstitution.InstitutionId,
                                    ZoneId = masterZone.ZoneId,
                                    CashPointId = masterCashPoint.CashpointId,
                                    DenominationId = masterDenomination.DenominationId,
                                    ContainerType = UnsortCAMemberBarcodeWrap,
                                    SequenceNo = 0,
                                    IsActive = true,
                                };

                            // Todo ถ้าไม่มี seq running set 1 และ insert
                            unsortCAMemberBarcodeWrapSequence.SequenceNo += 1;
                            if (unsortCAMemberBarcodeWrapSequence.CreatedDate == null)
                            {
                                unsortCAMemberBarcodeWrapSequence.CreatedDate = DateTime.Today;
                                unsortCAMemberBarcodeWrapSequence.CreatedBy = _transactionPreparation.UpdatedBy;
                                await _unitOfWork.BssTransactionContainerSequenceRepos.AddAsync(
                                    unsortCAMemberBarcodeWrapSequence);
                            }
                            else
                            {
                                unsortCAMemberBarcodeWrapSequence.UpdatedDate = DateTime.Today;
                                unsortCAMemberBarcodeWrapSequence.UpdatedBy = _transactionPreparation.UpdatedBy;
                            }

                            _transactionPreparation.PackageCode = GenerateBarcodeWrap(masterInstitution,
                                masterCompanyDepartment,
                                masterCashType, masterDenomination, _transactionPreparation.PrepareDate,
                                unsortCAMemberBarcodeWrapSequence.SequenceNo.Value);
                        }

                        // Todo validate format before end process
                        if (isValidateAfterGenerate)
                        {
                            ValidateBarcodeRequest unsortCAMemberBarcodeWrapValidateRequest =
                                new ValidateBarcodeRequest
                                {
                                    ValidateBarcodeType = BarcodeTypeConstants.BarcodeWrap,
                                    BssBNTypeCode = BssBNTypeCodeConstants.UnsortCAMember,
                                    ValidateBarcodeItem = new List<ValidateBarcodeItem>
                                    {
                                        new()
                                        {
                                            BarcodeType = BarcodeTypeConstants.BarcodeWrap,
                                            BarcodeValue = _transactionPreparation.PackageCode
                                        }
                                    }
                                };

                            var unsortCAMemberBarcodeWrapValidateResult =
                                await ValidateBarcodeWrapAsync(unsortCAMemberBarcodeWrapValidateRequest);
                            if (!unsortCAMemberBarcodeWrapValidateResult.IsValid)
                            {
                                throw new Exception(unsortCAMemberBarcodeWrapValidateResult.ErrorMessage);
                            }
                        }

                        #endregion GenerateWrapBarcode

                        #region GenerateBundleBarcode

                        string UnsortCAMemberBarcodeBundle =
                            $"{BssBNTypeCodeConstants.UnsortCAMember}_{BarcodeTypeConstants.BarcodeBundle}";
                        BssTransactionContainerSequence? unsortCAMemberBarcodeBundleSequence =
                            await _unitOfWork.BssTransactionContainerSequenceRepos
                                .GetBssTransactionContainerSequenceByTypeParameterAsync(UnsortCAMemberBarcodeBundle,
                                    _departmentId.Value, masterInstitution.InstitutionId,
                                    masterDenomination.DenominationId,
                                    zoneId: masterZone.ZoneId, cashPointId: masterCashPoint.CashpointId) ??
                            new BssTransactionContainerSequence
                            {
                                DepartmentId = _departmentId.Value,
                                InstitutionId = masterInstitution.InstitutionId,
                                ZoneId = masterZone.ZoneId,
                                CashPointId = masterCashPoint.CashpointId,
                                DenominationId = masterDenomination.DenominationId,
                                ContainerType = UnsortCAMemberBarcodeBundle,
                                SequenceNo = 0,
                                IsActive = true,
                            };

                        // Todo ถ้าไม่มี seq running set 1 และ insert
                        unsortCAMemberBarcodeBundleSequence.SequenceNo += 1;
                        if (unsortCAMemberBarcodeBundleSequence.CreatedDate == null)
                        {
                            unsortCAMemberBarcodeBundleSequence.CreatedDate = DateTime.Today;
                            unsortCAMemberBarcodeBundleSequence.CreatedBy = _transactionPreparation.UpdatedBy;
                            await _unitOfWork.BssTransactionContainerSequenceRepos.AddAsync(
                                unsortCAMemberBarcodeBundleSequence);
                        }
                        else
                        {
                            unsortCAMemberBarcodeBundleSequence.UpdatedDate = DateTime.Today;
                            unsortCAMemberBarcodeBundleSequence.UpdatedBy = _transactionPreparation.UpdatedBy;
                        }

                        string unsortCAMemberBundleCode = GenerateBarcodeBundle(_transactionPreparation.PackageCode,
                            masterCashPoint, unsortCAMemberBarcodeBundleSequence.SequenceNo.Value, zone: masterZone);

                        // Todo validate format before end process
                        if (isValidateAfterGenerate)
                        {
                            ValidateBarcodeRequest unsortCAMemberBarcodeBundleValidateRequest =
                                new ValidateBarcodeRequest
                                {
                                    ValidateBarcodeType = BarcodeTypeConstants.BarcodeBundle,
                                    ValidateBarcodeItem = new List<ValidateBarcodeItem>
                                    {
                                        new()
                                        {
                                            BarcodeType = BarcodeTypeConstants.BarcodeWrap,
                                            BarcodeValue = _transactionPreparation.PackageCode
                                        },
                                        new()
                                        {
                                            BarcodeType = BarcodeTypeConstants.BarcodeBundle,
                                            BarcodeValue = unsortCAMemberBundleCode
                                        }
                                    }
                                };
                            unsortCAMemberBarcodeBundleValidateRequest.BssBNTypeCode =
                                BssBNTypeCodeConstants.UnsortCAMember;
                            var unsortCAMemberBarcodeBundleValidateResult = await
                                ValidateBarcodeWrapAsync(unsortCAMemberBarcodeBundleValidateRequest);
                            if (!unsortCAMemberBarcodeBundleValidateResult.IsValid)
                            {
                                throw new Exception(unsortCAMemberBarcodeBundleValidateResult.ErrorMessage);
                            }
                        }

                        _transactionPreparation.BundleCode = unsortCAMemberBundleCode;

                        #endregion GenerateBundleBarcode

                        break;
                    case BNType.UnsortCC:

                        masterInstitution = await _unitOfWork.InstitutionRepos.GetAsync(w =>
                            w.InstitutionId == _transactionPreparation.InstId && w.IsActive == true);
                        masterZone = await _unitOfWork.ZoneRepos.GetAsync(w =>
                            w.ZoneId == _transactionPreparation.ZoneId && w.IsActive == true);
                        masterCashType = await _unitOfWork.CashtypeRepos.GetAsync(w =>
                            w.CashTypeId == CashTypeConstants.UnsortCC &&
                            w.IsActive == true);
                        masterCashPoint = await _unitOfWork.CashPointRepos.GetAsync(w =>
                            w.CashpointId == _transactionPreparation.CashpointId && w.IsActive == true);
                        masterDenomination = await _unitOfWork.DenominationRepos.GetAsync(w =>
                            w.DenominationId == _transactionPreparation.DenoId &&
                            w.IsActive == true);

                        if (masterInstitution == null || masterZone == null || masterCashType == null
                            || masterCashPoint == null || masterDenomination == null)
                        {
                            throw new InvalidParameterException(
                                "generate barcode fail. master data parameter not found.");
                        }

                        #region GenerateWrapBarcode

                        if (isGenerateBarcodeWrap)
                        {
                            string UnsortCCBarcodeWrap =
                                $"{BssBNTypeCodeConstants.UnsortCC}_{BarcodeTypeConstants.BarcodeWrap}";
                            BssTransactionContainerSequence? unsortCCBarcodeWrapSequence =
                                await _unitOfWork.BssTransactionContainerSequenceRepos
                                    .GetBssTransactionContainerSequenceByTypeParameterAsync(UnsortCCBarcodeWrap,
                                        _departmentId.Value, masterInstitution.InstitutionId,
                                        masterDenomination.DenominationId,
                                        zoneId: masterZone.ZoneId, cashPointId: masterCashPoint.CashpointId) ??
                                new BssTransactionContainerSequence
                                {
                                    DepartmentId = _departmentId.Value,
                                    InstitutionId = masterInstitution.InstitutionId,
                                    ZoneId = masterZone.ZoneId,
                                    CashPointId = masterCashPoint.CashpointId,
                                    DenominationId = masterDenomination.DenominationId,
                                    ContainerType = UnsortCCBarcodeWrap,
                                    SequenceNo = 0,
                                    IsActive = true,
                                };

                            // Todo ถ้าไม่มี seq running set 1 และ insert
                            unsortCCBarcodeWrapSequence.SequenceNo += 1;
                            if (unsortCCBarcodeWrapSequence.CreatedDate == null)
                            {
                                unsortCCBarcodeWrapSequence.CreatedDate = DateTime.Today;
                                unsortCCBarcodeWrapSequence.CreatedBy = _transactionPreparation.UpdatedBy;
                                await _unitOfWork.BssTransactionContainerSequenceRepos.AddAsync(
                                    unsortCCBarcodeWrapSequence);
                            }
                            else
                            {
                                unsortCCBarcodeWrapSequence.UpdatedDate = DateTime.Today;
                                unsortCCBarcodeWrapSequence.UpdatedBy = _transactionPreparation.UpdatedBy;
                            }

                            _transactionPreparation.PackageCode = GenerateBarcodeWrap(masterInstitution,
                                masterCompanyDepartment,
                                masterCashType, masterDenomination, _transactionPreparation.PrepareDate,
                                unsortCCBarcodeWrapSequence.SequenceNo.Value);
                        }

                        // Todo validate format before end process
                        if (isValidateAfterGenerate)
                        {
                            ValidateBarcodeRequest unsortCCBarcodeWrapValidateRequest =
                                new ValidateBarcodeRequest
                                {
                                    ValidateBarcodeType = BarcodeTypeConstants.BarcodeWrap,
                                    BssBNTypeCode = BssBNTypeCodeConstants.UnsortCC,
                                    ValidateBarcodeItem = new List<ValidateBarcodeItem>
                                    {
                                        new()
                                        {
                                            BarcodeType = BarcodeTypeConstants.BarcodeWrap,
                                            BarcodeValue = _transactionPreparation.PackageCode
                                        }
                                    }
                                };

                            var unsortCAMemberBarcodeWrapValidateResult =
                                await ValidateBarcodeWrapAsync(unsortCCBarcodeWrapValidateRequest);
                            if (!unsortCAMemberBarcodeWrapValidateResult.IsValid)
                            {
                                throw new Exception(unsortCAMemberBarcodeWrapValidateResult.ErrorMessage);
                            }
                        }

                        #endregion GenerateWrapBarcode

                        #region GenerateBundleBarcode

                        string UnsortCCBarcodeBundle =
                            $"{BssBNTypeCodeConstants.UnsortCC}_{BarcodeTypeConstants.BarcodeBundle}";
                        BssTransactionContainerSequence? unsortCCMemberBarcodeBundleSequence =
                            await _unitOfWork.BssTransactionContainerSequenceRepos
                                .GetBssTransactionContainerSequenceByTypeParameterAsync(UnsortCCBarcodeBundle,
                                    _departmentId.Value, masterInstitution.InstitutionId,
                                    masterDenomination.DenominationId,
                                    zoneId: masterZone.ZoneId, cashPointId: masterCashPoint.CashpointId) ??
                            new BssTransactionContainerSequence
                            {
                                DepartmentId = _departmentId.Value,
                                InstitutionId = masterInstitution.InstitutionId,
                                ZoneId = masterZone.ZoneId,
                                CashPointId = masterCashPoint.CashpointId,
                                DenominationId = masterDenomination.DenominationId,
                                ContainerType = UnsortCCBarcodeBundle,
                                SequenceNo = 0,
                                IsActive = true,
                            };

                        // Todo ถ้าไม่มี seq running set 1 และ insert
                        unsortCCMemberBarcodeBundleSequence.SequenceNo += 1;
                        if (unsortCCMemberBarcodeBundleSequence.CreatedDate == null)
                        {
                            unsortCCMemberBarcodeBundleSequence.CreatedDate = DateTime.Today;
                            unsortCCMemberBarcodeBundleSequence.CreatedBy = _transactionPreparation.UpdatedBy;
                            await _unitOfWork.BssTransactionContainerSequenceRepos.AddAsync(
                                unsortCCMemberBarcodeBundleSequence);
                        }
                        else
                        {
                            unsortCCMemberBarcodeBundleSequence.UpdatedDate = DateTime.Today;
                            unsortCCMemberBarcodeBundleSequence.UpdatedBy = _transactionPreparation.UpdatedBy;
                        }

                        string unsortCCBundleCode = GenerateBarcodeBundle(_transactionPreparation.PackageCode,
                            masterCashPoint, unsortCCMemberBarcodeBundleSequence.SequenceNo.Value, zone: masterZone);

                        // Todo validate format before end process
                        if (isValidateAfterGenerate)
                        {
                            ValidateBarcodeRequest unsortCCBarcodeBundleValidateRequest =
                                new ValidateBarcodeRequest
                                {
                                    ValidateBarcodeType = BarcodeTypeConstants.BarcodeBundle,
                                    ValidateBarcodeItem = new List<ValidateBarcodeItem>
                                    {
                                        new()
                                        {
                                            BarcodeType = BarcodeTypeConstants.BarcodeWrap,
                                            BarcodeValue = _transactionPreparation.PackageCode
                                        },
                                        new()
                                        {
                                            BarcodeType = BarcodeTypeConstants.BarcodeBundle,
                                            BarcodeValue = unsortCCBundleCode
                                        }
                                    }
                                };

                            var unsortCCBarcodeBundleValidateResult =
                                await ValidateBarcodeBundleAsync(unsortCCBarcodeBundleValidateRequest);
                            if (!unsortCCBarcodeBundleValidateResult.IsValid)
                            {
                                throw new Exception(unsortCCBarcodeBundleValidateResult.ErrorMessage);
                            }
                        }

                        _transactionPreparation.BundleCode = unsortCCBundleCode;

                        #endregion GenerateBundleBarcode

                        break;
                    default:
                        break;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"generate barcode error. {ex.Message}");
            }
        }

        public async Task<BarcodePreviewResponse?> PreviewGenerateBarcodeAsync(BNType bnType, bool isFirstScan = true)
        {
            try
            {
                if (_transactionContainerPrepare == null ||
                    _transactionContainerPrepare.TransactionPreparation.Count == 0)
                {
                    throw new Exception(
                        "preview generate barcode fail. transaction container prepare or prepare is null.");
                }

                MasterInstitution? masterInstitution;
                MasterCashType? masterCashType;
                MasterCashCenter? masterCashCenter;
                MasterZone? masterZone;
                MasterCashPoint? masterCashPoint;
                MasterDenomination? masterDenomination;
                MasterCompanyDepartment? masterCompanyDepartment;

                masterCompanyDepartment = await _unitOfWork.CompanyDepartmentRepos.GetAsync(w =>
                    w.CompanyId == _companyId && w.DepartmentId == _departmentId && w.IsActive == true);

                if (masterCompanyDepartment == null)
                {
                    throw new InvalidParameterException(
                        "preview generate barcode fail. master company department not found.");
                }

                #region ComputeRunningNumber

                int? numberOfBarcodeWrapToGenerate = 1;
                int? numberOfBarcodeBundleToGenerate = 1;

                _transactionPreparation = _transactionContainerPrepare.TransactionPreparation.ToList().Last();
                if (_transactionPreparation.PrepareId == 0 && _transactionPreparation.IsActive == true)
                {
                    var lastPrepareFromDatabase =
                        await _unitOfWork.TransactionPreparationRepos
                            .GetLastTransactionPreparationWithContainerIdAsync(_transactionContainerPrepare
                                .ContainerPrepareId);

                    if (lastPrepareFromDatabase != null)
                    {
                        if (isFirstScan)
                        {
                            numberOfBarcodeWrapToGenerate =
                                StringHelper.GetLast4DigitFromStringAndConvertToInt(lastPrepareFromDatabase
                                    .PackageCode) + 1;
                            numberOfBarcodeBundleToGenerate = 1;
                        }
                        else
                        {
                            numberOfBarcodeWrapToGenerate =
                                StringHelper.GetLast4DigitFromStringAndConvertToInt(lastPrepareFromDatabase
                                    .PackageCode);
                            if (bnType == BNType.UnsortCC)
                            {
                                numberOfBarcodeBundleToGenerate =
                                    StringHelper.GetLast3DigitFromStringAndConvertToInt(lastPrepareFromDatabase
                                        .BundleCode) + 1;
                            }
                            else
                            {
                                numberOfBarcodeBundleToGenerate =
                                    StringHelper.GetLast4DigitFromStringAndConvertToInt(lastPrepareFromDatabase
                                        .BundleCode) + 1;
                            }
                        }
                    }
                    else
                    {
                        if (isFirstScan)
                        {
                            numberOfBarcodeWrapToGenerate = 1;
                            numberOfBarcodeBundleToGenerate = 1;
                        }
                        else
                        {
                            return null;
                        }
                    }
                }
                else
                {
                    throw new Exception(
                        "preview generate barcode fail. transaction preparation is not new or not active.");
                }

                #endregion ComputeRunningNumber

                BarcodePreviewResponse preview = new BarcodePreviewResponse();

                switch (bnType)
                {
                    case BNType.UnsortCANonMember:

                        masterInstitution = await _unitOfWork.InstitutionRepos.GetAsync(w =>
                            w.InstitutionId == _transactionPreparation.InstId && w.IsActive == true);
                        masterCashCenter = await _unitOfWork.CashCenterRepos.GetAsync(w =>
                            w.CashCenterId == _transactionPreparation.CashcenterId && w.IsActive == true);
                        masterCashType = await _unitOfWork.CashtypeRepos.GetAsync(w =>
                            w.CashTypeId == CashTypeConstants.UnsortCA &&
                            w.IsActive == true);
                        masterDenomination = await _unitOfWork.DenominationRepos.GetAsync(w =>
                            w.DenominationId == _transactionPreparation.DenoId &&
                            w.IsActive == true);

                        if (masterInstitution == null || masterCashCenter == null || masterCashType == null ||
                            masterDenomination == null)
                        {
                            throw new InvalidParameterException(
                                "preview generate barcode fail. master data parameter not found.");
                        }

                        var runningNoCANonMember = numberOfBarcodeWrapToGenerate.Value;

                        preview.PackageCode = GenerateBarcodeWrapForCaNonMember(masterInstitution,
                            masterCashCenter,
                            masterCashType, masterDenomination, _transactionPreparation.PrepareDate,
                            runningNoCANonMember);

                        var isDuplicateCANonMember = await _unitOfWork.TransactionPreparationRepos
                            .ExistsPackageCodeAsync(preview.PackageCode);

                        if (isDuplicateCANonMember && isFirstScan)
                        {
                            var prefix = preview.PackageCode.Substring(0, preview.PackageCode.Length - 4);

                            var latestPackageCode = await _unitOfWork.TransactionPreparationRepos
                                .GetLatestPackageCodeByPrefixAsync(prefix);

                            int lastRunning = 0;

                            if (!string.IsNullOrEmpty(latestPackageCode))
                            {
                                lastRunning = int.Parse(latestPackageCode.Substring(latestPackageCode.Length - 4));
                            }

                            runningNoCANonMember = lastRunning + 1;

                            preview.PackageCode = GenerateBarcodeWrapForCaNonMember(
                                masterInstitution,
                                masterCashCenter,
                                masterCashType,
                                masterDenomination,
                                _transactionPreparation.PrepareDate,
                                runningNoCANonMember
                            );
                        }

                        preview.BundleCode =
                            GenerateBarcodeBundle(preview.PackageCode, numberOfBarcodeBundleToGenerate.Value);
                        preview.WrapSequence = runningNoCANonMember;
                        preview.BundleSequence = numberOfBarcodeBundleToGenerate.Value;

                        break;

                    case BNType.UnsortCC:

                        masterInstitution = await _unitOfWork.InstitutionRepos.GetAsync(w =>
                            w.InstitutionId == _transactionPreparation.InstId && w.IsActive == true);
                        masterZone = await _unitOfWork.ZoneRepos.GetAsync(w =>
                            w.ZoneId == _transactionPreparation.ZoneId && w.IsActive == true);
                        masterCashType = await _unitOfWork.CashtypeRepos.GetAsync(w =>
                            w.CashTypeId == CashTypeConstants.UnsortCC &&
                            w.IsActive == true);
                        masterCashPoint = await _unitOfWork.CashPointRepos.GetAsync(w =>
                            w.CashpointId == _transactionPreparation.CashpointId && w.IsActive == true);
                        masterDenomination = await _unitOfWork.DenominationRepos.GetAsync(w =>
                            w.DenominationId == _transactionPreparation.DenoId &&
                            w.IsActive == true);

                        if (masterInstitution == null || masterZone == null || masterCashType == null
                            || masterCashPoint == null || masterDenomination == null)
                        {
                            throw new InvalidParameterException(
                                "preview generate barcode fail. master data parameter not found.");
                        }

                        var runningNoUnsortCC = numberOfBarcodeWrapToGenerate.Value;

                        preview.PackageCode = GenerateBarcodeWrapForUnsortCC(masterInstitution,
                            masterCompanyDepartment,
                            masterCashType, masterDenomination, _transactionPreparation.PrepareDate,
                            runningNoUnsortCC);

                        var isDuplicateUnsortCC = await _unitOfWork.TransactionPreparationRepos
                            .ExistsPackageCodeAsync(preview.PackageCode);

                        if (isDuplicateUnsortCC && isFirstScan)
                        {
                            var prefix = preview.PackageCode.Substring(0, preview.PackageCode.Length - 4);

                            var latestPackageCode = await _unitOfWork.TransactionPreparationRepos
                                .GetLatestPackageCodeByPrefixAsync(prefix);

                            int lastRunning = 0;

                            if (!string.IsNullOrEmpty(latestPackageCode))
                            {
                                lastRunning = int.Parse(latestPackageCode.Substring(latestPackageCode.Length - 4));
                            }

                            runningNoUnsortCC = lastRunning + 1;

                            preview.PackageCode = GenerateBarcodeWrap(
                                masterInstitution,
                                masterCompanyDepartment,
                                masterCashType,
                                masterDenomination,
                                _transactionPreparation.PrepareDate,
                                runningNoUnsortCC
                            );
                        }

                        preview.BundleCode = GenerateBarcodeBundle(preview.PackageCode, masterCashPoint, numberOfBarcodeBundleToGenerate.Value, zone: masterZone);
                        preview.WrapSequence = runningNoUnsortCC;
                        preview.BundleSequence = numberOfBarcodeBundleToGenerate.Value;

                        break;

                    default:
                        break;
                }

                return preview;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task GenerateBarcodeVersion2Async(BNType bnType, bool isFirstScan = true,
            bool isValidateAfterGenerate = false)
        {
            try
            {
                if (_transactionContainerPrepare == null ||
                    _transactionContainerPrepare.TransactionPreparation.Count == 0)
                {
                    throw new Exception("generate barcode fail. transaction container prepare or prepare is null.");
                }

                MasterInstitution? masterInstitution;
                MasterCashType? masterCashType;
                MasterCashCenter? masterCashCenter;
                MasterZone? masterZone;
                MasterCashPoint? masterCashPoint;
                MasterDenomination? masterDenomination;
                MasterCompanyDepartment? masterCompanyDepartment;

                masterCompanyDepartment = await _unitOfWork.CompanyDepartmentRepos.GetAsync(w =>
                    w.CompanyId == _companyId && w.DepartmentId == _departmentId && w.IsActive == true);

                if (masterCompanyDepartment == null)
                {
                    throw new InvalidParameterException(
                        "generate barcode fail. master company department not found.");
                }

                #region ComputeRunningNumber

                int? numberOfBarcodeWrapToGenerate = 1;
                int? numberOfBarcodeBundleToGenerate = 1;


                // Todo get prepare ตัวล่าสุดที่อยู่ใน list prepare ต้องเป็น prepare ใหม่ที่ยังไม่มี PrepareId และ IsActive = true
                _transactionPreparation = _transactionContainerPrepare.TransactionPreparation.ToList().Last();
                if (_transactionPreparation.PrepareId == 0 && _transactionPreparation.IsActive == true)
                {
                    var lastPrepareFromDatabase =
                        await _unitOfWork.TransactionPreparationRepos
                            .GetLastTransactionPreparationWithContainerIdAsync(_transactionContainerPrepare
                                .ContainerPrepareId);

                    if (lastPrepareFromDatabase != null)
                    {
                        // Todo มี prepare ของเก่า
                        if (isFirstScan)
                        {
                            // Todo barcode ห่อต้อง gen ต่อจากเดิมและ barcode มัดเริ่มที่ 1 ถ้าเป็น first scan
                            numberOfBarcodeWrapToGenerate =
                                StringHelper.GetLast4DigitFromStringAndConvertToInt(lastPrepareFromDatabase
                                    .PackageCode) + 1;
                            numberOfBarcodeBundleToGenerate = 1;
                        }
                        else
                        {
                            // Todo scan prepare ต่อเนื่องภายในห่อเดิม
                            // Todo barcode ห่อต้องใช้เลขเดิมและ barcode มัดเพิ่มจากเดิมทีละ 1
                            numberOfBarcodeWrapToGenerate =
                                StringHelper.GetLast4DigitFromStringAndConvertToInt(lastPrepareFromDatabase
                                    .PackageCode);

                            if (bnType == BNType.UnsortCC)
                            {
                                numberOfBarcodeBundleToGenerate =
                                    StringHelper.GetLast3DigitFromStringAndConvertToInt(lastPrepareFromDatabase
                                        .BundleCode) + 1;
                            }
                            else
                            {
                                numberOfBarcodeBundleToGenerate =
                                    StringHelper.GetLast4DigitFromStringAndConvertToInt(lastPrepareFromDatabase
                                        .BundleCode) + 1;
                            }
                        }
                    }
                    else
                    {
                        // Todo scan ครั้งแรกและไม่มี prepare ของเก่า
                        if (isFirstScan)
                        {
                            // Todo barcode ห่อและมัด ต้อง gen ใหม่เริ่มจาก 1
                            numberOfBarcodeWrapToGenerate = 1;
                            numberOfBarcodeBundleToGenerate = 1;
                        }
                        else
                        {
                            // Todo scan prepare ต่อเนื่องภายในห่อเดิม
                            // Todo barcode ห่อต้อง gen ต่อเลขเดิมและ barcode มัดเพิ่มจากเดิมทีละ 1
                            // Todo case นี้เป็นไปไม่ได้ที่ scan ต่อเนื่องแล้วจะไม่มี lastPrepareFromDatabase
                            return;
                        }
                    }
                }
                else
                {
                    throw new Exception("generate barcode fail. transaction preparation is not new or not active.");
                }

                #endregion ComputeRunningNumber

                BssTransactionContainerSequence? barcodeWrapSequence = null;
                BssTransactionContainerSequence? barcodeBundleSequence = null;

                #region GenerateBarcode

                switch (bnType)
                {
                    case BNType.Unfit:
                        throw new NotImplementedException();

                    case BNType.UnsortCAMember:

                        masterInstitution = await _unitOfWork.InstitutionRepos.GetAsync(w =>
                            w.InstitutionId == _transactionPreparation.InstId && w.IsActive == true);
                        masterZone = await _unitOfWork.ZoneRepos.GetAsync(w =>
                            w.ZoneId == _transactionPreparation.ZoneId && w.IsActive == true);
                        masterCashType = await _unitOfWork.CashtypeRepos.GetAsync(w =>
                            w.CashTypeId == CashTypeConstants.UnsortCA &&
                            w.IsActive == true);
                        masterCashPoint = await _unitOfWork.CashPointRepos.GetAsync(w =>
                            w.CashpointId == _transactionPreparation.CashpointId && w.IsActive == true);
                        masterDenomination = await _unitOfWork.DenominationRepos.GetAsync(w =>
                            w.DenominationId == _transactionPreparation.DenoId &&
                            w.IsActive == true);

                        if (masterInstitution == null || masterZone == null || masterCashType == null
                            || masterCashPoint == null || masterDenomination == null)
                        {
                            throw new InvalidParameterException(
                                "generate barcode fail. master data parameter not found.");
                        }

                        _transactionPreparation.PackageCode = GenerateBarcodeWrap(masterInstitution,
                            masterCompanyDepartment,
                            masterCashType, masterDenomination, _transactionPreparation.PrepareDate,
                            numberOfBarcodeWrapToGenerate.Value);

                        _transactionPreparation.BundleCode = GenerateBarcodeBundle(_transactionPreparation.PackageCode,
                            masterCashPoint, numberOfBarcodeBundleToGenerate.Value, zone: masterZone);

                        string UnsortCAMemberBarcodeWrap =
                            $"{BssBNTypeCodeConstants.UnsortCAMember}_{BarcodeTypeConstants.BarcodeWrap}";
                        string UnsortCAMemberBarcodeBundle =
                            $"{BssBNTypeCodeConstants.UnsortCAMember}_{BarcodeTypeConstants.BarcodeBundle}";

                        barcodeWrapSequence = await _unitOfWork.BssTransactionContainerSequenceRepos
                                                  .GetBssTransactionContainerSequenceByTypeParameterAsync(
                                                      UnsortCAMemberBarcodeWrap,
                                                      _departmentId.Value, masterInstitution.InstitutionId,
                                                      masterDenomination.DenominationId,
                                                      zoneId: masterZone.ZoneId,
                                                      cashPointId: masterCashPoint.CashpointId) ??
                                              new BssTransactionContainerSequence
                                              {
                                                  DepartmentId = _departmentId.Value,
                                                  InstitutionId = masterInstitution.InstitutionId,
                                                  ZoneId = masterZone.ZoneId,
                                                  CashPointId = masterCashPoint.CashpointId,
                                                  DenominationId = masterDenomination.DenominationId,
                                                  ContainerType = UnsortCAMemberBarcodeWrap,
                                                  SequenceNo = 0,
                                                  IsActive = true,
                                              };

                        barcodeBundleSequence = await _unitOfWork.BssTransactionContainerSequenceRepos
                                                    .GetBssTransactionContainerSequenceByTypeParameterAsync(
                                                        UnsortCAMemberBarcodeBundle,
                                                        _departmentId.Value, masterInstitution.InstitutionId,
                                                        masterDenomination.DenominationId,
                                                        zoneId: masterZone.ZoneId,
                                                        cashPointId: masterCashPoint.CashpointId) ??
                                                new BssTransactionContainerSequence
                                                {
                                                    DepartmentId = _departmentId.Value,
                                                    InstitutionId = masterInstitution.InstitutionId,
                                                    ZoneId = masterZone.ZoneId,
                                                    CashPointId = masterCashPoint.CashpointId,
                                                    DenominationId = masterDenomination.DenominationId,
                                                    ContainerType = UnsortCAMemberBarcodeBundle,
                                                    SequenceNo = 0,
                                                    IsActive = true,
                                                };

                        break;
                    case BNType.UnsortCANonMember:

                        masterInstitution = await _unitOfWork.InstitutionRepos.GetAsync(w =>
                            w.InstitutionId == _transactionPreparation.InstId && w.IsActive == true);
                        masterCashCenter = await _unitOfWork.CashCenterRepos.GetAsync(w =>
                            w.CashCenterId == _transactionPreparation.CashcenterId && w.IsActive == true);
                        masterCashType = await _unitOfWork.CashtypeRepos.GetAsync(w =>
                            w.CashTypeId == CashTypeConstants.UnsortCA &&
                            w.IsActive == true);
                        masterDenomination = await _unitOfWork.DenominationRepos.GetAsync(w =>
                            w.DenominationId == _transactionPreparation.DenoId &&
                            w.IsActive == true);

                        if (masterInstitution == null || masterCashCenter == null || masterCashType == null ||
                            masterDenomination == null)
                        {
                            throw new InvalidParameterException(
                                "generate barcode fail. master data parameter not found.");
                        }

                        var runningNo = numberOfBarcodeWrapToGenerate.Value;

                        _transactionPreparation.PackageCode = GenerateBarcodeWrapForCaNonMember(masterInstitution,
                            masterCashCenter,
                            masterCashType, masterDenomination, _transactionPreparation.PrepareDate,
                            runningNo);

                        #region CheckDuplicatePackageBarcode

                        // check duplicate barcode ห่อใน database ถ้ามีให้ generate ใหม่โดยเพิ่ม running no ไปเรื่อยๆ จนกว่าจะไม่ซ้ำ
                        var isDuplicateUnsortCANon = await _unitOfWork.TransactionPreparationRepos
                            .ExistsPackageCodeAsync(_transactionPreparation.PackageCode);

                        if (isDuplicateUnsortCANon && isFirstScan)
                        {
                            // ตัด 4 digit ท้ายออก → prefix
                            var prefix = _transactionPreparation.PackageCode.Substring(
                                0,
                                _transactionPreparation.PackageCode.Length - 4
                            );

                            // ดึง packageCode ล่าสุดของ prefix นี้
                            var latestPackageCode = await _unitOfWork.TransactionPreparationRepos
                                .GetLatestPackageCodeByPrefixAsync(prefix);

                            int lastRunning = 0;

                            if (!string.IsNullOrEmpty(latestPackageCode))
                            {
                                lastRunning = int.Parse(
                                    latestPackageCode.Substring(latestPackageCode.Length - 4)
                                );
                            }

                            runningNo = lastRunning + 1;

                            // generate ใหม่ด้วย running ล่าสุด
                            _transactionPreparation.PackageCode =
                                GenerateBarcodeWrapForCaNonMember(
                                    masterInstitution,
                                    masterCashCenter,
                                    masterCashType,
                                    masterDenomination,
                                    _transactionPreparation.PrepareDate,
                                    runningNo
                                );
                        }

                        #endregion

                        _transactionPreparation.BundleCode = GenerateBarcodeBundle(
                            _transactionPreparation.PackageCode,
                            numberOfBarcodeBundleToGenerate.Value);

                        string unsortCANonMemberBarcodeWrap =
                            $"{BssBNTypeCodeConstants.UnsortCANonMember}_{BarcodeTypeConstants.BarcodeWrap}";
                        string unsortCANonMemberBarcodeBundle =
                            $"{BssBNTypeCodeConstants.UnsortCANonMember}_{BarcodeTypeConstants.BarcodeBundle}";

                        barcodeWrapSequence = await _unitOfWork.BssTransactionContainerSequenceRepos
                                                  .GetBssTransactionContainerSequenceByTypeParameterAsync(
                                                      unsortCANonMemberBarcodeWrap,
                                                      _departmentId.Value, masterInstitution.InstitutionId,
                                                      masterDenomination.DenominationId,
                                                      cashCenterId: masterCashCenter.CashCenterId) ??
                                              new BssTransactionContainerSequence
                                              {
                                                  DepartmentId = _departmentId.Value,
                                                  InstitutionId = masterInstitution.InstitutionId,
                                                  CashCenterId = masterCashCenter.CashCenterId,
                                                  DenominationId = masterDenomination.DenominationId,
                                                  ContainerType = unsortCANonMemberBarcodeWrap,
                                                  SequenceNo = 0,
                                                  IsActive = true,
                                              };

                        barcodeBundleSequence = await _unitOfWork.BssTransactionContainerSequenceRepos
                            .GetBssTransactionContainerSequenceByTypeParameterAsync(unsortCANonMemberBarcodeBundle,
                                _departmentId.Value, masterInstitution.InstitutionId,
                                masterDenomination.DenominationId,
                                cashCenterId: masterCashCenter.CashCenterId) ?? new BssTransactionContainerSequence
                        {
                            DepartmentId = _departmentId.Value,
                            InstitutionId = masterInstitution.InstitutionId,
                            CashCenterId = masterCashCenter.CashCenterId,
                            DenominationId = masterDenomination.DenominationId,
                            ContainerType = unsortCANonMemberBarcodeBundle,
                            SequenceNo = 0,
                            IsActive = true,
                        };

                        break;
                    case BNType.UnsortCC:

                        masterInstitution = await _unitOfWork.InstitutionRepos.GetAsync(w =>
                            w.InstitutionId == _transactionPreparation.InstId && w.IsActive == true);
                        masterZone = await _unitOfWork.ZoneRepos.GetAsync(w =>
                            w.ZoneId == _transactionPreparation.ZoneId && w.IsActive == true);
                        masterCashType = await _unitOfWork.CashtypeRepos.GetAsync(w =>
                            w.CashTypeId == CashTypeConstants.UnsortCC &&
                            w.IsActive == true);
                        masterCashPoint = await _unitOfWork.CashPointRepos.GetAsync(w =>
                            w.CashpointId == _transactionPreparation.CashpointId && w.IsActive == true);
                        masterDenomination = await _unitOfWork.DenominationRepos.GetAsync(w =>
                            w.DenominationId == _transactionPreparation.DenoId &&
                            w.IsActive == true);

                        if (masterInstitution == null || masterZone == null || masterCashType == null
                            || masterCashPoint == null || masterDenomination == null)
                        {
                            throw new InvalidParameterException(
                                "generate barcode fail. master data parameter not found.");
                        }

                        _transactionPreparation.PackageCode = GenerateBarcodeWrapForUnsortCC(masterInstitution,
                            masterCompanyDepartment,
                            masterCashType, masterDenomination, _transactionPreparation.PrepareDate,
                            numberOfBarcodeWrapToGenerate.Value);

                        #region CheckDuplicatePackageBarcode

                        // check duplicate barcode ห่อใน database ถ้ามีให้ generate ใหม่โดยเพิ่ม running no ไปเรื่อยๆ จนกว่าจะไม่ซ้ำ
                        var isDuplicateUnsortCC = await _unitOfWork.TransactionPreparationRepos
                            .ExistsPackageCodeAsync(_transactionPreparation.PackageCode);

                        if (isDuplicateUnsortCC && isFirstScan)
                        {
                            // ตัด 4 digit ท้ายออก → prefix
                            var prefix = _transactionPreparation.PackageCode.Substring(
                                0,
                                _transactionPreparation.PackageCode.Length - 4
                            );

                            // ดึง packageCode ล่าสุดของ prefix นี้
                            var latestPackageCode = await _unitOfWork.TransactionPreparationRepos
                                .GetLatestPackageCodeByPrefixAsync(prefix);

                            int lastRunning = 0;

                            if (!string.IsNullOrEmpty(latestPackageCode))
                            {
                                lastRunning = int.Parse(
                                    latestPackageCode.Substring(latestPackageCode.Length - 4)
                                );
                            }

                            runningNo = lastRunning + 1;

                            // generate ใหม่ด้วย running ล่าสุด
                            _transactionPreparation.PackageCode =
                                GenerateBarcodeWrap(
                                    masterInstitution,
                                    masterCompanyDepartment,
                                    masterCashType,
                                    masterDenomination,
                                    _transactionPreparation.PrepareDate,
                                    runningNo
                                );
                        }

                        #endregion

                        _transactionPreparation.BundleCode = GenerateBarcodeBundle(_transactionPreparation.PackageCode,
                            masterCashPoint, numberOfBarcodeBundleToGenerate.Value, zone: masterZone);

                        string UnsortCCBarcodeWrap =
                            $"{BssBNTypeCodeConstants.UnsortCC}_{BarcodeTypeConstants.BarcodeWrap}";
                        string UnsortCCBarcodeBundle =
                            $"{BssBNTypeCodeConstants.UnsortCC}_{BarcodeTypeConstants.BarcodeBundle}";

                        barcodeWrapSequence = await _unitOfWork.BssTransactionContainerSequenceRepos
                                                  .GetBssTransactionContainerSequenceByTypeParameterAsync(
                                                      UnsortCCBarcodeWrap,
                                                      _departmentId.Value, masterInstitution.InstitutionId,
                                                      masterDenomination.DenominationId,
                                                      zoneId: masterZone.ZoneId,
                                                      cashPointId: masterCashPoint.CashpointId) ??
                                              new BssTransactionContainerSequence
                                              {
                                                  DepartmentId = _departmentId.Value,
                                                  InstitutionId = masterInstitution.InstitutionId,
                                                  ZoneId = masterZone.ZoneId,
                                                  CashPointId = masterCashPoint.CashpointId,
                                                  DenominationId = masterDenomination.DenominationId,
                                                  ContainerType = UnsortCCBarcodeWrap,
                                                  SequenceNo = 0,
                                                  IsActive = true,
                                              };

                        barcodeBundleSequence = await _unitOfWork.BssTransactionContainerSequenceRepos
                                                    .GetBssTransactionContainerSequenceByTypeParameterAsync(
                                                        UnsortCCBarcodeBundle,
                                                        _departmentId.Value, masterInstitution.InstitutionId,
                                                        masterDenomination.DenominationId,
                                                        zoneId: masterZone.ZoneId,
                                                        cashPointId: masterCashPoint.CashpointId) ??
                                                new BssTransactionContainerSequence
                                                {
                                                    DepartmentId = _departmentId.Value,
                                                    InstitutionId = masterInstitution.InstitutionId,
                                                    ZoneId = masterZone.ZoneId,
                                                    CashPointId = masterCashPoint.CashpointId,
                                                    DenominationId = masterDenomination.DenominationId,
                                                    ContainerType = UnsortCCBarcodeBundle,
                                                    SequenceNo = 0,
                                                    IsActive = true,
                                                };


                        break;
                    default:
                        break;
                }

                #endregion GenerateBarcode

                #region ValidateAfterGenerate

                // Todo validate barcode format after generated.
                if (isValidateAfterGenerate)
                {
                    switch (bnType)
                    {
                        case BNType.UnsortCANonMember:
                            ValidateBarcodeRequest unsortCANonMemberBarcodeWrapValidateRequest =
                            new ValidateBarcodeRequest
                            {
                                ValidateExistingInDatabase = false,
                                ValidateBarcodeType = BarcodeTypeConstants.BarcodeWrap,
                                BssBNTypeCode = BssBNTypeCodeConstants.UnsortCANonMember,
                                ValidateBarcodeItem = new List<ValidateBarcodeItem>
                                {
                                    new()
                                    {
                                        BarcodeType = BarcodeTypeConstants.BarcodeWrap,
                                        BarcodeValue = _transactionPreparation.PackageCode
                                    }
                                }
                            };

                            var unsortCANonMemberBarcodeWrapValidateResult =
                                await ValidateBarcodeWrapAsync(unsortCANonMemberBarcodeWrapValidateRequest);
                            if (!unsortCANonMemberBarcodeWrapValidateResult.IsValid)
                            {
                                throw new Exception(unsortCANonMemberBarcodeWrapValidateResult.ErrorMessage);
                            }

                            ValidateBarcodeRequest unsortCANonMemberBarcodeBundleValidateRequest =
                                new ValidateBarcodeRequest
                                {
                                    ValidateExistingInDatabase = false,
                                    ValidateBarcodeType = BarcodeTypeConstants.BarcodeBundle,
                                    ValidateBarcodeItem = new List<ValidateBarcodeItem>
                                    {
                                        new()
                                        {
                                            BarcodeType = BarcodeTypeConstants.BarcodeWrap,
                                            BarcodeValue = _transactionPreparation.PackageCode
                                        },
                                        new()
                                        {
                                            BarcodeType = BarcodeTypeConstants.BarcodeBundle,
                                            BarcodeValue = _transactionPreparation.BundleCode
                                        }
                                    }
                                };

                            var unsortCANonMemberBarcodeBundleValidateResult =
                                await ValidateBarcodeBundleAsync(unsortCANonMemberBarcodeBundleValidateRequest);
                            if (!unsortCANonMemberBarcodeBundleValidateResult.IsValid)
                            {
                                throw new Exception(unsortCANonMemberBarcodeBundleValidateResult.ErrorMessage);
                            }
                            break;

                        case BNType.UnsortCC:
                            ValidateBarcodeRequest unsortCCBarcodeWrapValidateRequest =
                                new ValidateBarcodeRequest
                                {
                                    ValidateBarcodeType = BarcodeTypeConstants.BarcodeWrap,
                                    BssBNTypeCode = BssBNTypeCodeConstants.UnsortCC,
                                    ValidateBarcodeItem = new List<ValidateBarcodeItem>
                                    {
                                        new()
                                        {
                                            BarcodeType = BarcodeTypeConstants.BarcodeWrap,
                                            BarcodeValue = _transactionPreparation.PackageCode
                                        }
                                    }
                                };

                            var unsortCAMemberBarcodeWrapValidateResult =
                                await ValidateBarcodeWrapAsync(unsortCCBarcodeWrapValidateRequest);
                            if (!unsortCAMemberBarcodeWrapValidateResult.IsValid)
                            {
                                throw new Exception(unsortCAMemberBarcodeWrapValidateResult.ErrorMessage);
                            }

                            ValidateBarcodeRequest unsortCCBarcodeBundleValidateRequest =
                                new ValidateBarcodeRequest
                                {
                                    ValidateBarcodeType = BarcodeTypeConstants.BarcodeBundle,
                                    ValidateBarcodeItem = new List<ValidateBarcodeItem>
                                    {
                                        new()
                                        {
                                            BarcodeType = BarcodeTypeConstants.BarcodeWrap,
                                            BarcodeValue = _transactionPreparation.PackageCode
                                        },
                                        new()
                                        {
                                            BarcodeType = BarcodeTypeConstants.BarcodeBundle,
                                            BarcodeValue = _transactionPreparation.BundleCode
                                        }
                                    }
                                };

                            var unsortCCBarcodeBundleValidateResult =
                                await ValidateBarcodeBundleAsync(unsortCCBarcodeBundleValidateRequest);
                            if (!unsortCCBarcodeBundleValidateResult.IsValid)
                            {
                                throw new Exception(unsortCCBarcodeBundleValidateResult.ErrorMessage);
                            }
                            break;

                        default:
                            break;
                    }
                }

                #endregion ValidateAfterGenerate

                #region TrackSequenceNumber

                if (barcodeWrapSequence != null)
                {
                    barcodeWrapSequence.SequenceNo = numberOfBarcodeWrapToGenerate;
                    if (barcodeWrapSequence.CreatedDate == null)
                    {
                        barcodeWrapSequence.CreatedDate = DateTime.Today;
                        barcodeWrapSequence.CreatedBy = _transactionPreparation.UpdatedBy;
                        await _unitOfWork.BssTransactionContainerSequenceRepos.AddAsync(barcodeWrapSequence);
                    }
                    else
                    {
                        barcodeWrapSequence.UpdatedDate = DateTime.Today;
                        barcodeWrapSequence.UpdatedBy = _transactionPreparation.UpdatedBy;
                    }
                }

                if (barcodeBundleSequence != null)
                {
                    barcodeBundleSequence.SequenceNo = null;
                    barcodeBundleSequence.TotalBundle =
                        _transactionContainerPrepare.TransactionPreparation
                            .Count; // Todo เก็บ total ของ prepare ทั้งหมดว่าสร้างไปแล้วเท่าไหร

                    if (barcodeBundleSequence.CreatedDate == null)
                    {
                        barcodeBundleSequence.CreatedDate = DateTime.Today;
                        barcodeBundleSequence.CreatedBy = _transactionPreparation.UpdatedBy;
                        await _unitOfWork.BssTransactionContainerSequenceRepos.AddAsync(barcodeBundleSequence);
                    }
                    else
                    {
                        barcodeBundleSequence.UpdatedDate = DateTime.Today;
                        barcodeBundleSequence.CreatedBy = _transactionPreparation.UpdatedBy;
                    }
                }

                #endregion TrackSequenceNumber
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string> GenerateSequenceNumberAsync(GenerateSequenceTypeEnum generateSequenceType,
            string oldRunningNumber,
            string? prefix = null)
        {
            if (_unitOfWork == null)
            {
                throw new ArgumentNullException(nameof(_unitOfWork));
            }

            if (_departmentId == null)
            {
                throw new ArgumentNullException(nameof(_departmentId));
            }

            try
            {
                string sequenceRunningNumber = string.Empty;
                switch (generateSequenceType)
                {
                    case GenerateSequenceTypeEnum.REFERENCE_SEQUENCE:
                        throw new NotImplementedException();
                        break;
                    case GenerateSequenceTypeEnum.SEND_UNSORT_SEQUENCE:

                        MasterSendUnsortSequence? masterSendUnsortSequence =
                            await _unitOfWork.MasterSendUnsortSequenceRepos.GetLastSendUnsortSequenceByDepartmentAsync(
                                _departmentId.Value);

                        prefix = string.IsNullOrEmpty(prefix) ? "UCC" : prefix;

                        if (masterSendUnsortSequence == null)
                        {
                            // Todo create new sequence running
                            masterSendUnsortSequence = new MasterSendUnsortSequence
                            {
                                DepartmentId = _departmentId.Value,
                                SendSequenceNumber = 1,
                                IsActive = true,
                                CreatedDate = DateTime.Now,
                            };
                        }
                        else
                        {
                            string compareSequenceRunningNumber =
                                $"{prefix}{DateTime.Now:yyyyMMdd}{NumberHelper.To2Digits(_departmentId.Value)}{NumberHelper.To4Digits(masterSendUnsortSequence.SendSequenceNumber)}";

                            if (!string.IsNullOrEmpty(oldRunningNumber) &&
                                oldRunningNumber == compareSequenceRunningNumber)
                            {
                                return oldRunningNumber;
                            }

                            masterSendUnsortSequence.SendSequenceNumber += 1;
                            masterSendUnsortSequence.UpdatedDate = DateTime.Now;
                        }

                        sequenceRunningNumber =
                            $"{prefix}{DateTime.Now:yyyyMMdd}{NumberHelper.To2Digits(_departmentId.Value)}{NumberHelper.To4Digits(masterSendUnsortSequence.SendSequenceNumber)}";

                        if (masterSendUnsortSequence.SendSequenceNumber == 1)
                        {
                            await _unitOfWork.MasterSendUnsortSequenceRepos.AddAsync(masterSendUnsortSequence);
                        }
                        else
                        {
                            _unitOfWork.MasterSendUnsortSequenceRepos.Update(masterSendUnsortSequence);
                        }

                        await _unitOfWork.SaveChangeAsync();

                        break;
                    default:
                        return string.Empty;
                }

                return sequenceRunningNumber;
            }
            catch (Exception)
            {
                throw new Exception("generate delivery note code error.");
            }
        }

        public async Task ImportCbmsGenerateBarcodeAsync(bool isValidateAfterGenerate = false)
        {
            throw new NotImplementedException();

            MasterInstitution? masterInstitution;
            MasterCashType? masterCashType;
            MasterCashCenter? masterCashCenter;
            MasterDenomination? masterDenomination;
            MasterCompanyDepartment? masterCompanyDepartment;

            if (_receiveCbmsDataTransaction == null)
            {
                throw new ArgumentNullException(nameof(_receiveCbmsDataTransaction));
            }

            try
            {
                masterInstitution =
                    await _unitOfWork.InstitutionRepos.GetAsync(
                        w => w.InstitutionId == _receiveCbmsDataTransaction.InstitutionId, tracked: false);

                masterCashCenter =
                    await _unitOfWork.CashCenterRepos.GetAsync(
                        w => w.CashCenterCode == _receiveCbmsDataTransaction.CbBdcCode, tracked: false);

                masterCashType =
                    await _unitOfWork.CashtypeRepos.GetAsync(w => w.CashTypeId == CashTypeConstants.UnsortCA,
                        tracked: false);

                masterDenomination =
                    await _unitOfWork.DenominationRepos.GetAsync(
                        w => w.DenominationId == _receiveCbmsDataTransaction.DenominationId, tracked: false);

                masterCompanyDepartment = await _unitOfWork.CompanyDepartmentRepos.GetAsync(
                    w => w.DepartmentId == _receiveCbmsDataTransaction.DepartmentId &&
                         w.CbBcdCode == _receiveCbmsDataTransaction.CbBdcCode, tracked: false);

                if (masterInstitution == null || masterCashCenter == null || masterCashType == null ||
                    masterDenomination == null || masterCompanyDepartment == null)
                {
                    throw new InvalidParameterException(
                        "generate barcode fail. master data parameter not found.");
                }

                #region GenerateWrapBarcode

                string unsortCANonMemberBarcodeWrap =
                    $"{BssBNTypeCodeConstants.UnsortCANonMember}_{BarcodeTypeConstants.BarcodeWrap}";

                BssTransactionContainerSequence? unsortCANonMemberBarcodeWrapSequence =
                    await _unitOfWork.BssTransactionContainerSequenceRepos
                        .GetBssTransactionContainerSequenceByTypeParameterAsync(unsortCANonMemberBarcodeWrap,
                            _receiveCbmsDataTransaction.DepartmentId, masterInstitution.InstitutionId,
                            masterDenomination.DenominationId,
                            cashCenterId: masterCashCenter.CashCenterId) ?? new BssTransactionContainerSequence
                    {
                        DepartmentId = _receiveCbmsDataTransaction.DepartmentId,
                        InstitutionId = masterInstitution.InstitutionId,
                        CashCenterId = masterCashCenter.CashCenterId,
                        DenominationId = masterDenomination.DenominationId,
                        ContainerType = unsortCANonMemberBarcodeWrap,
                        SequenceNo = 0,
                        IsActive = true
                    };

                // Todo ถ้าไม่มี seq running set 1 และ insert
                unsortCANonMemberBarcodeWrapSequence.SequenceNo += 1;
                if (unsortCANonMemberBarcodeWrapSequence.CreatedDate == null)
                {
                    unsortCANonMemberBarcodeWrapSequence.CreatedDate = DateTime.Today;
                    await _unitOfWork.BssTransactionContainerSequenceRepos.AddAsync(
                        unsortCANonMemberBarcodeWrapSequence);
                }
                else
                {
                    unsortCANonMemberBarcodeWrapSequence.UpdatedDate = DateTime.Today;
                }

                string unsortCANonMemberPackageCode = GenerateBarcodeWrap(masterInstitution,
                    masterCompanyDepartment,
                    masterCashType, masterDenomination, _receiveCbmsDataTransaction.SendDate.Value,
                    unsortCANonMemberBarcodeWrapSequence.SequenceNo.Value);

                // Todo validate format before next step
                if (isValidateAfterGenerate)
                {
                    ValidateBarcodeRequest unsortCANonMemberBarcodeWrapValidateRequest =
                        new ValidateBarcodeRequest
                        {
                            ValidateBarcodeType = BarcodeTypeConstants.BarcodeWrap,
                            BssBNTypeCode = BssBNTypeCodeConstants.UnsortCANonMember,
                            ValidateBarcodeItem = new List<ValidateBarcodeItem>
                            {
                                new()
                                {
                                    BarcodeType = BarcodeTypeConstants.BarcodeWrap,
                                    BarcodeValue = unsortCANonMemberPackageCode
                                }
                            }
                        };

                    var unsortCANonMemberBarcodeWrapValidateResult =
                        await ValidateBarcodeWrapAsync(unsortCANonMemberBarcodeWrapValidateRequest);

                    if (!unsortCANonMemberBarcodeWrapValidateResult.IsValid)
                    {
                        throw new Exception(unsortCANonMemberBarcodeWrapValidateResult.ErrorMessage);
                    }
                }

                _receiveCbmsDataTransaction.BarCode = unsortCANonMemberPackageCode;

                #endregion GenerateWrapBarcode
            }
            catch (Exception)
            {
                throw;
            }
        }

        #region Builder

        public class ValidateBarcodeServiceBuilder
        {
            private readonly BarcodeService _barcodeService = new();

            public ValidateBarcodeServiceBuilder SetValidateBarcodeRequest(
                ValidateBarcodeRequest? validateBarcodeRequest)
            {
                if (validateBarcodeRequest == null) throw new ArgumentNullException(nameof(validateBarcodeRequest));
                _barcodeService._validateBarcodeRequest = validateBarcodeRequest;
                return this;
            }

            public ValidateBarcodeServiceBuilder SetUnitOfWork(IUnitOfWork? unitOfWork)
            {
                if (unitOfWork == null) throw new ArgumentNullException(nameof(unitOfWork));
                _barcodeService._unitOfWork = unitOfWork;
                return this;
            }

            public ValidateBarcodeServiceBuilder SetTransactionPreparation(
                TransactionPreparation? transactionPreparation, int? companyId = null, int? departmentId = null)
            {
                if (departmentId == null) throw new ArgumentNullException(nameof(departmentId));
                if (companyId == null) throw new ArgumentNullException(nameof(companyId));
                if (transactionPreparation == null) throw new ArgumentNullException(nameof(transactionPreparation));

                _barcodeService._companyId = companyId;
                _barcodeService._departmentId = departmentId;
                _barcodeService._transactionPreparation = transactionPreparation;
                return this;
            }

            public ValidateBarcodeServiceBuilder SetTransactionContainerPrepare(
                TransactionContainerPrepare? transactionContainerPrepare, int? companyId = null,
                int? departmentId = null)
            {
                if (departmentId == null) throw new ArgumentNullException(nameof(departmentId));
                if (companyId == null) throw new ArgumentNullException(nameof(companyId));
                if (transactionContainerPrepare == null)
                    throw new ArgumentNullException(nameof(transactionContainerPrepare));

                _barcodeService._companyId = companyId;
                _barcodeService._departmentId = departmentId;
                _barcodeService._transactionContainerPrepare = transactionContainerPrepare;
                return this;
            }

            public ValidateBarcodeServiceBuilder SetReceiveCbmsDataTransaction(
                ReceiveCbmsDataTransaction? receiveCbmsDataTransaction)
            {
                if (receiveCbmsDataTransaction == null)
                    throw new ArgumentNullException(nameof(receiveCbmsDataTransaction));
                _barcodeService._receiveCbmsDataTransaction = receiveCbmsDataTransaction;
                return this;
            }

            public ValidateBarcodeServiceBuilder SetDepartment(int? departmentId)
            {
                if (departmentId == null)
                    throw new ArgumentNullException(nameof(departmentId));
                _barcodeService._departmentId = departmentId;
                return this;
            }

            public BarcodeService Build()
            {
                return _barcodeService;
            }
        }

        #endregion Builder

        #region GenerateBarcodeImplementation

        /// <summary>
        /// การสร้าง Barcode ห่อ 18 หลัก 
        /// </summary>
        /// <param name="institution">หลักที่ 1-3: รหัสธนาคาร</param>
        /// <param name="companyDepartment.CbBcdCode">หลักที่ 4-6: รหัส ศูนย์เงินสด (CCC)</param>
        /// <param name="cashType">หลักที่ 7: รหัสประเภทธนบัตร</param>
        /// <param name="denomination">หลักที่ 8: รหัสชนิดราคา</param>
        /// <param name="prepareDate">หลักที่ 9-14: YYMMDD วันที่ Prepare (พ.ศ.)</param>
        /// <param name="sequence">หลักที่ 15-18: Running no</param>
        /// <returns>(ธนาคาร+ศูนย์เงินสด+ชนิดราคา+ประเภท+วันที่ Prepare) Reset ทุกเที่ยงคืน</returns>
        private string GenerateBarcodeWrap(MasterInstitution institution, MasterCompanyDepartment companyDepartment,
            MasterCashType cashType,
            MasterDenomination denomination, DateTime prepareDate, int sequence)
        {
            //var prepareDateString = prepareDate.ToString("yyMMdd");
            var prepareDateString = DateTimeHelper.ToBuddhistDateYYMMDD(prepareDate);
            return
                $"{institution.InstitutionCode}{companyDepartment.CbBcdCode}{cashType.CashTypeCode}{denomination.DenominationCode}{prepareDateString}{NumberHelper.To4Digits(sequence)}";
        }


        /// <summary>
        /// การสร้าง Barcode ห่อ 18 หลัก 
        /// </summary>
        /// <param name="institution">หลักที่ 1-3: รหัสธนาคาร</param>
        /// <param name="masterCashCenter.CashCenterCode">หลักที่ 4-6: รหัส ศูนย์เงินสด (CCC)</param>
        /// <param name="cashType">หลักที่ 7: รหัสประเภทธนบัตร</param>
        /// <param name="denomination">หลักที่ 8: รหัสชนิดราคา</param>
        /// <param name="prepareDate">หลักที่ 9-14: YYMMDD วันที่ Prepare (พ.ศ.)</param>
        /// <param name="sequence">หลักที่ 15-18: Running no</param>
        /// <returns>(ธนาคาร+ศูนย์เงินสด+ชนิดราคา+ประเภท+วันที่ Prepare) Reset ทุกเที่ยงคืน</returns>
        private string GenerateBarcodeWrapForCaNonMember(MasterInstitution institution,
            MasterCashCenter masterCashCenter,
            MasterCashType cashType,
            MasterDenomination denomination, DateTime prepareDate, int sequence)
        {
            //var prepareDateString = prepareDate.ToString("yyMMdd");
            var prepareDateString = DateTimeHelper.ToBuddhistDateYYMMDD(prepareDate);
            return
                $"{institution.InstitutionCode}{masterCashCenter.CashCenterCode}{cashType.CashTypeCode}{denomination.DenominationCode}{prepareDateString}{NumberHelper.To4Digits(sequence)}";
        }

        /// <summary>
        ///  การสร้าง Barcode ห่อ 18 หลัก สำหรับ Unsort CC
        /// </summary>
        /// <param name="institution"></param>
        /// <param name="companyDepartment"></param>
        /// <param name="cashType"></param>
        /// <param name="denomination"></param>
        /// <param name="prepareDate"></param>
        /// <param name="sequence"></param>
        /// <returns></returns>
        private string GenerateBarcodeWrapForUnsortCC(MasterInstitution institution, MasterCompanyDepartment companyDepartment,
            MasterCashType cashType,
            MasterDenomination denomination, DateTime prepareDate, int sequence)
        {
            var prepareDateString = DateTimeHelper.ToBuddhistDateYYMMDD(prepareDate);
            return
                $"{institution.InstitutionCode}{companyDepartment.CbBcdCode}{cashType.CashTypeCode}{denomination.DenominationCode}{prepareDateString}{NumberHelper.To4Digits(sequence)}";
        }

        /// <summary>
        /// การสร้าง Barcode มัด 24 หลัก prepare ประเภท CA
        /// </summary>
        /// <param name="wrapBarcode">หลักที่ 1-18: Barcode ห่อ</param>
        /// <param>หลักที่ 19-20: 00</param>
        /// <param name="sequence">หลักที่ 21-24: Running no Reset ทุกเที่ยงคืน</param>
        /// <returns>Barcode มัด + barcode ห่อ</returns>
        private string GenerateBarcodeBundle(string wrapBarcode, int sequence)
        {
            return $"{wrapBarcode}00{NumberHelper.To4Digits(sequence)}";
        }

        /// <summary>
        /// การสร้าง Barcode มัด 24 หลัก prepare ประะเภท Unsort CC
        /// </summary>
        /// <param name="wrapBarcode">หลักที่ 1-14: Barcode ห่อ ใช้ 14 หลักแรก</param>
        /// <param name="zone">หลักที่ 15-16 : Zone code จะมี  (2 หลัก ค่า 01 - 99) เป็นตัวเลข ถ้าเลือกธนาคารแล้วไม่มี zone จะใส่ 99</param>
        /// <param name="cashPoint">หลักที่ 17-21: Cashpoint Code (5 หลัก)</param>
        /// <param name="sequence">หลักที่ 22-24: Running no (3 หลัก ค่า 1-999) Reset ทุกเที่ยงคืน</param>
        /// <returns>Barcode มัด 24 หลัก</returns>
        private string GenerateBarcodeBundle(string wrapBarcode, MasterCashPoint? cashPoint, int sequence,
            MasterZone? zone = null)
        {
            var fixWrapBarcode = wrapBarcode.Length > 14 ? wrapBarcode.Substring(0, 14) : string.Empty;
            return $"{fixWrapBarcode}{zone.ZoneCode}{cashPoint.BranchCode}{NumberHelper.To3Digits(sequence)}";
        }

        #endregion GenerateBarcodeImplementation

        #region ValidateBarcodeImplementation

        /// <summary>
        /// barcode ภาชนะ format ต้อง == 7 หลัก
        /// มีอักษรผสม กับ ตัวเลข
        /// ไม่สามารถมีเครื่องหมายพิเศษได้
        /// ต้องไม่มีค่าติดลบ
        /// ต้องไม่มีค่าทศนิยม
        /// </summary>
        /// <param name="validateBarcodeRequest"></param>
        /// <returns>barcode ภาชนะถูกต้อง</returns>
        /// <fail>barcode ภาชนะไม่ถูกต้อง</fail>
        private async Task<ValidateBarcodeResponse?> ValidateBarcodeContainerAsync(
            ValidateBarcodeRequest validateBarcodeRequest)
        {
            var barcodeContainer = validateBarcodeRequest.ValidateBarcodeItem
                .FirstOrDefault(item => item.BarcodeType == BarcodeTypeConstants.BarcodeContainer);

            ValidateBarcodeResponse validateBarcodeResponse = new ValidateBarcodeResponse();
            if (barcodeContainer == null)
            {
                validateBarcodeResponse.IsValid = false;
                validateBarcodeResponse.ErrorMessage = string.Format(
                    ValidateBarcodeErrorMessage.ValidateTypeParameterNotFound,
                    BarcodeTypeConstants.BarcodeContainer);
                return validateBarcodeResponse;
            }

            if (!string.IsNullOrEmpty(barcodeContainer.BarcodeValue) && barcodeContainer.BarcodeValue.Length == 7)
            {
                ICollection<MasterConfig> masterConfigList =
                    await _unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync(ConfigConstants.BSS_WORK_DAY);

                string currCbBcdCode = string.Empty;
                MasterCompanyDepartment? masterCompanyDepartment = null;
                masterCompanyDepartment =
                    await _unitOfWork.CompanyDepartmentRepos.GetAsync(mcd =>
                            mcd.DepartmentId == validateBarcodeRequest.DepartmentId && mcd.IsActive == true,
                        tracked: false);

                if (masterCompanyDepartment != null)
                {
                    currCbBcdCode = masterCompanyDepartment.CbBcdCode ?? string.Empty;
                }

                #region ValidateBarcodeExistingInCbmsData

                DateTime startDate = masterConfigList.ToScanPrepareBssWorkDayStartDateTime();
                DateTime endDate = masterConfigList.ToScanPrepareBssWorkDayEndDateTime();

                if (validateBarcodeRequest.ValidateExistingInDatabase)
                {
                    string bnTypeCodeInput = string.Empty;
                    if (validateBarcodeRequest.BssBNTypeCode == BssBNTypeCodeConstants.Unfit ||
                        validateBarcodeRequest.BssBNTypeCode == BssBNTypeCodeConstants.UnsortCANonMember ||
                        validateBarcodeRequest.BssBNTypeCode == BssBNTypeCodeConstants.UnsortCAMember)
                    {
                        bnTypeCodeInput = validateBarcodeRequest.BssBNTypeCode == BssBNTypeCodeConstants.Unfit
                            ? BNTypeCodeConstants.Unfit
                            : BNTypeCodeConstants.UnsortCAMember;

                        var receiveCbmsData =
                            await _unitOfWork.CbmsTransactionRepos.GetAllAsync(w =>
                                    w.DepartmentId == validateBarcodeRequest.DepartmentId &&
                                    w.ContainerId == barcodeContainer.BarcodeValue &&
                                    w.BnTypeInput == bnTypeCodeInput &&
                                    w.SendDate >= startDate && w.SendDate <= endDate,
                                tracked: false);
                        if (receiveCbmsData == null || receiveCbmsData.ToList().Count == 0)
                        {
                            validateBarcodeResponse.IsValid = false;
                            validateBarcodeResponse.ErrorMessage =
                                string.Format(ValidateBarcodeErrorMessage.BarcodeContainerNotFound,
                                    barcodeContainer.BarcodeValue);

                            return validateBarcodeResponse;
                        }

                        if (receiveCbmsData.All(a => a.RemainingQty <= 0))
                        {
                            // Todo ไม่มีธนบัตรในภาชนะนี้แล้ว
                            validateBarcodeResponse.IsValid = false;
                            validateBarcodeResponse.ErrorMessage = ValidateBarcodeErrorMessage.BarcodeContainerEmptyQty;

                            return validateBarcodeResponse;
                        }

                        #region ValidateCompanyInstitutionForCA

                        if (validateBarcodeRequest.BssBNTypeCode == BssBNTypeCodeConstants.UnsortCANonMember ||
                            validateBarcodeRequest.BssBNTypeCode == BssBNTypeCodeConstants.UnsortCAMember)
                        {
                            foreach (var receiveitem in receiveCbmsData)
                            {
                                var masterCompanyInstitution =
                                    await _unitOfWork.CompanyInstitutionRepos.GetAsync(mci =>
                                        mci.InstId == receiveitem.InstitutionId &&
                                        mci.CbBcdCode == currCbBcdCode &&
                                        mci.IsActive == true, tracked: false);

                                var masterInstitution =
                                    await _unitOfWork.InstitutionRepos.GetAsync(
                                        mi => mi.InstitutionId == receiveitem.InstitutionId,
                                        tracked: false);


                                if (masterCompanyInstitution == null)
                                {
                                    validateBarcodeResponse.IsValid = false;
                                    validateBarcodeResponse.ErrorMessage =
                                        string.Format(ValidateBarcodeErrorMessage.ValidateCompanyInstitutionInvalid,
                                            masterInstitution?.InstitutionCode ?? "");

                                    return validateBarcodeResponse;
                                }
                                else
                                {
                                    if (validateBarcodeRequest.BssBNTypeCode ==
                                        BssBNTypeCodeConstants.UnsortCANonMember)
                                    {
                                        //var cashCenterCode = receiveitem.CbBdcCode; //For CA Non Member

                                        MasterCashCenter? masterCashCenter = null;
                                        masterCashCenter =
                                            await _unitOfWork.CashCenterRepos.GetAsync(cc =>
                                                    cc.CashCenterCode == receiveitem.CbBdcCode &&
                                                    cc.IsActive == true,
                                                tracked: false);

                                        if (masterCashCenter == null)
                                        {
                                            validateBarcodeResponse.IsValid = false;
                                            validateBarcodeResponse.ErrorMessage =
                                                string.Format(ValidateBarcodeErrorMessage.ValidateCashCenterInvalid,
                                                    masterCashCenter?.CashCenterCode ?? "");
                                            return validateBarcodeResponse;
                                        }
                                    }
                                }
                            }
                        }

                        #endregion ValidateCompanyInstitutionForCA
                    }
                    else if (validateBarcodeRequest.BssBNTypeCode == BssBNTypeCodeConstants.UnsortCC)
                    {
                        var registerUnsort = await _unitOfWork.TransactionRegisterUnsortRepos.GetAsync(w =>
                            w.ContainerCode == barcodeContainer.BarcodeValue &&
                            w.StatusId == BssStatusConstants.Received &&
                            w.ReceivedDate >= startDate && w.ReceivedDate <= endDate
                            && w.IsActive == true, tracked: false);

                        if (registerUnsort == null)
                        {
                            validateBarcodeResponse.IsValid = false;
                            validateBarcodeResponse.ErrorMessage =
                                string.Format(ValidateBarcodeErrorMessage.BarcodeContainerNotFound,
                                    barcodeContainer.BarcodeValue);

                            return validateBarcodeResponse;
                        }

                        #region ValidateCompanyInstitutionForUnsortCC

                        var unsortCC = await _unitOfWork.TransactionUnsortCCRepos.GetAllAsync(tcc =>
                            tcc.RegisterUnsortId == registerUnsort.RegisterUnsortId, tracked: false);

                        if (unsortCC == null || !unsortCC.Any() || unsortCC.All(x => x.RemainingQty <= 0))
                        {
                            validateBarcodeResponse.IsValid = false;
                            validateBarcodeResponse.ErrorMessage =
                                string.Format(ValidateBarcodeErrorMessage.BarcodeContainerNotFound,
                                    barcodeContainer.BarcodeValue);

                            return validateBarcodeResponse;
                        }

                        foreach (var itemUnsort in unsortCC)
                        {
                            var masterCompanyInstitution =
                                await _unitOfWork.CompanyInstitutionRepos.GetAsync(mci =>
                                    mci.InstId == itemUnsort.InstId &&
                                    mci.CbBcdCode == currCbBcdCode &&
                                    mci.IsActive == true, tracked: false);

                            if (masterCompanyInstitution == null)
                            {
                                var masterInstitution =
                                    await _unitOfWork.InstitutionRepos.GetAsync(
                                        mi => mi.InstitutionId == itemUnsort.InstId,
                                        tracked: false);


                                validateBarcodeResponse.IsValid = false;
                                validateBarcodeResponse.ErrorMessage =
                                    string.Format(ValidateBarcodeErrorMessage.ValidateCompanyInstitutionInvalid,
                                        masterInstitution?.InstitutionCode ?? "");

                                return validateBarcodeResponse;
                            }
                        }

                        #endregion ValidateCompanyInstitutionForUnsortCC
                    }
                    else if (validateBarcodeRequest.BssBNTypeCode == BssBNTypeCodeConstants.RegisterUnsortCC)
                    {
                        List<int> notInStatus = [BssStatusConstants.Finished, BssStatusConstants.DeletedPrePrepare];
                        var registerUnsort = await _unitOfWork.TransactionRegisterUnsortRepos.GetAsync(w =>
                            w.ContainerCode == barcodeContainer.BarcodeValue &&
                            !notInStatus.Contains(w.StatusId) &&
                            w.ReceivedDate >= startDate && w.ReceivedDate <= endDate
                            && w.IsActive == true, tracked: false);

                        if (registerUnsort != null)
                        {
                            validateBarcodeResponse.IsValid = false;
                            validateBarcodeResponse.ErrorMessage =
                                string.Format(ValidateBarcodeErrorMessage.BarcodeContainerDuplicate,
                                    barcodeContainer.BarcodeValue);

                            return validateBarcodeResponse;
                        }
                    }
                    else
                    {
                        validateBarcodeResponse.IsValid = false;
                        validateBarcodeResponse.ErrorMessage =
                            string.Format(ValidateBarcodeErrorMessage.BnTypeParameterNotFound,
                                validateBarcodeRequest.BssBNTypeCode);

                        return validateBarcodeResponse;
                    }
                }

                #endregion ValidateBarcodeExistingInCbmsData

                #region ValidateFormat

                if (!Regex.IsMatch(barcodeContainer.BarcodeValue, @"^[A-Za-z0-9]+$"))
                {
                    validateBarcodeResponse.IsValid = false;
                    validateBarcodeResponse.ErrorMessage = ValidateBarcodeErrorMessage.BarcodeContainerFail;
                    return validateBarcodeResponse;
                }

                #endregion ValidateFormat

                #region ValidateContainerPrepare

                // Todo validate เฉพาะ user type หน้าเครื่อง
                if (validateBarcodeRequest is { MachineId: not null, DepartmentId: not null })
                {
                    // Todo implement date format and set action flags
                    ICollection<TransactionContainerPrepare> transactionContainerPrepares =
                        await _unitOfWork.TransactionContainerPrepareRepos.GetContainerPrepareWithMachineAsync(
                            barcodeContainer.BarcodeValue,
                            validateBarcodeRequest.DepartmentId.Value, validateBarcodeRequest.MachineId.Value,
                            startDate, endDate);

                    if (transactionContainerPrepares.Count > 0)
                    {
                        HashSet<string> conflictMachines = new HashSet<string>();
                        foreach (var containerPrepare in transactionContainerPrepares)
                        {
                            conflictMachines.Add(containerPrepare.MasterMachine.MachineName);
                            validateBarcodeResponse.Data.AddRange(containerPrepare.GetPreparationAllTypeResponse());
                        }

                        if (conflictMachines.Any())
                        {
                            validateBarcodeResponse.MachineConflictMessage = string.Format(
                                ValidateBarcodeSuccessMessage.PreparingAtOtherMachine,
                                string.Join(", ", conflictMachines.Distinct()));
                        }
                    }
                }

                #endregion ValidateContainerPrepare

                validateBarcodeResponse.IsValid = true;
                validateBarcodeResponse.ErrorMessage = ValidateBarcodeSuccessMessage.BarcodeContainerIsValid;
            }
            else
            {
                validateBarcodeResponse.IsValid = false;
                validateBarcodeResponse.ErrorMessage = ValidateBarcodeErrorMessage.BarcodeContainerLengthFail;
            }

            return validateBarcodeResponse;
        }

        /// <summary>
        /// barcode ห่อ format ต้อง == 18 หลัก และ หลักที่ 7 ต้อง == 2
        /// </summary>
        /// <param name="validateBarcodeRequest"></param>
        /// <returns>barcode ห่อถูกต้อง</returns>
        /// <fail>barcode ห่อไม่ถูกต้อง</fail>
        private async Task<ValidateBarcodeResponse?> ValidateBarcodeWrapAsync(
            ValidateBarcodeRequest validateBarcodeRequest)
        {
            var barcodeWrap = validateBarcodeRequest.ValidateBarcodeItem
                .FirstOrDefault(item => item.BarcodeType == BarcodeTypeConstants.BarcodeWrap);

            ValidateBarcodeResponse validateBarcodeResponse = new ValidateBarcodeResponse();
            if (barcodeWrap == null)
            {
                validateBarcodeResponse.IsValid = false;
                validateBarcodeResponse.ErrorMessage = string.Format(
                    ValidateBarcodeErrorMessage.ValidateTypeParameterNotFound,
                    BarcodeTypeConstants.BarcodeWrap);
                return validateBarcodeResponse;
            }

            #region ValidateBarcodeWrapExisting

            if (!string.IsNullOrEmpty(barcodeWrap.BarcodeValue) && barcodeWrap.BarcodeValue.Length == 18)
            {
                string bnTypeCodeInput = string.Empty;
                if (validateBarcodeRequest.BssBNTypeCode == BssBNTypeCodeConstants.Unfit ||
                    validateBarcodeRequest.BssBNTypeCode == BssBNTypeCodeConstants.UnsortCANonMember ||
                    validateBarcodeRequest.BssBNTypeCode == BssBNTypeCodeConstants.UnsortCAMember)
                {
                    bnTypeCodeInput = validateBarcodeRequest.BssBNTypeCode == BssBNTypeCodeConstants.Unfit
                        ? BNTypeCodeConstants.Unfit
                        : BNTypeCodeConstants.UnsortCAMember;

                    var barcodeWrapData =
                        await _unitOfWork.CbmsTransactionRepos.GetAllAsync(w =>
                                w.DepartmentId == validateBarcodeRequest.DepartmentId &&
                                w.BnTypeInput == bnTypeCodeInput &&
                                w.ContainerId == validateBarcodeRequest.ContainerId &&
                                w.BarCode == barcodeWrap.BarcodeValue,
                            tracked: false);

                    if (barcodeWrapData != null && barcodeWrapData.Any() &&
                        barcodeWrapData.All(a => a.RemainingQty <= 0))
                    {
                        // Todo มีการ scan ซ้ำหลังจาก prepare มัดครบแล้ว
                        validateBarcodeResponse.IsValid = false;
                        validateBarcodeResponse.ErrorMessage = ValidateBarcodeErrorMessage.BarcodeWrapEmptyQty;

                        return validateBarcodeResponse;
                    }
                }
            }

            #endregion

            MasterCashType? masterCashType = null;
            switch (validateBarcodeRequest.BssBNTypeCode)
            {
                case BssBNTypeCodeConstants.Unfit:
                    masterCashType =
                        await _unitOfWork.CashtypeRepos.GetAsync(w => w.CashTypeId == CashTypeConstants.Unfit,
                            tracked: false);
                    break;
                case BssBNTypeCodeConstants.UnsortCANonMember:
                case BssBNTypeCodeConstants.UnsortCAMember:
                    masterCashType =
                        await _unitOfWork.CashtypeRepos.GetAsync(w => w.CashTypeId == CashTypeConstants.UnsortCA,
                            tracked: false);
                    break;
                case BssBNTypeCodeConstants.UnsortCC:
                    masterCashType =
                        await _unitOfWork.CashtypeRepos.GetAsync(w => w.CashTypeId == CashTypeConstants.UnsortCC,
                            tracked: false);
                    break;
                default:
                    break;
            }

            if (masterCashType == null)
            {
                validateBarcodeResponse.IsValid = false;
                validateBarcodeResponse.ErrorMessage = string.Format(
                    ValidateBarcodeErrorMessage.ValidateTypeParameterNotFound,
                    nameof(masterCashType));
                return validateBarcodeResponse;
            }

            if (!string.IsNullOrEmpty(barcodeWrap.BarcodeValue) &&
                (barcodeWrap.BarcodeValue is { Length: 18 } &&
                 barcodeWrap.BarcodeValue[6] == char.Parse(masterCashType.CashTypeCode)))
            {
                validateBarcodeResponse.IsValid = true;
                validateBarcodeResponse.ErrorMessage = ValidateBarcodeSuccessMessage.BarcodeWrapIsValid;
            }
            else
            {
                validateBarcodeResponse.IsValid = false;
                validateBarcodeResponse.ErrorMessage = ValidateBarcodeErrorMessage.BarcodeWrapFail;
            }

            #region Add Validate For Unfit Check Company Institution and Cash Center

            if (validateBarcodeRequest.BssBNTypeCode == BssBNTypeCodeConstants.Unfit)
            {
                string currCbBcdCode = string.Empty;

                MasterCompanyDepartment? masterCompanyDepartment = null;
                masterCompanyDepartment =
                    await _unitOfWork.CompanyDepartmentRepos.GetAsync(d =>
                            d.DepartmentId == validateBarcodeRequest.DepartmentId &&
                            d.IsActive == true,
                        tracked: false);

                if (masterCompanyDepartment != null)
                {
                    currCbBcdCode = masterCompanyDepartment.CbBcdCode ?? "";
                }

                var instCode = barcodeWrap.BarcodeValue.Substring(0, 3);

                MasterInstitution? masterInstitution = null;
                masterInstitution =
                    await _unitOfWork.InstitutionRepos.GetAsync(w => w.InstitutionCode == instCode,
                        tracked: false);

                if (masterInstitution == null)
                {
                    validateBarcodeResponse.IsValid = false;
                    validateBarcodeResponse.ErrorMessage =
                        string.Format(ValidateBarcodeErrorMessage.ValidateCompanyInstitutionInvalid, instCode);
                }
                else
                {
                    MasterCompanyInstitution? masterCompanyInstitution = null;
                    masterCompanyInstitution =
                        await _unitOfWork.CompanyInstitutionRepos.GetAsync(mci =>
                                mci.InstId == masterInstitution.InstitutionId &&
                                mci.CbBcdCode == currCbBcdCode &&
                                mci.IsActive == true,
                            tracked: false);

                    if (masterCompanyInstitution == null)
                    {
                        validateBarcodeResponse.IsValid = false;
                        validateBarcodeResponse.ErrorMessage =
                            string.Format(ValidateBarcodeErrorMessage.ValidateCompanyInstitutionInvalid, instCode);
                    }
                    else
                    {
                        var cashCenterCode = barcodeWrap.BarcodeValue.Substring(3, 3);

                        MasterCashCenter? masterCashCenter = null;
                        masterCashCenter =
                            await _unitOfWork.CashCenterRepos.GetAsync(cc =>
                                    cc.CashCenterCode == cashCenterCode &&
                                    cc.IsActive == true,
                                tracked: false);

                        if (masterCashCenter == null)
                        {
                            validateBarcodeResponse.IsValid = false;
                            validateBarcodeResponse.ErrorMessage =
                                string.Format(ValidateBarcodeErrorMessage.ValidateCashCenterInvalid, cashCenterCode);
                        }
                    }
                }
            }

            #endregion Add Validate For Unfit Check Company Institution and Cash Center

            return validateBarcodeResponse;
        }

        /// <summary>
        /// barcode มัด format ต้อง == 24 หลัก
        /// เอา 3 หลักแรก ไปเทียบกับ barcode ห่อ ต้องตรงกัน
        /// หลัก 4 - 6 ข้าม
        /// หลักที่ 7 ไป เทียบกับหลักที่ 7 ของ barcode ห่อ ต้องเป็นเลข 2 เหมือนกัน
        /// หลักที่ 8 ไป เทียบกับ หลักที่ 8 ของ barcode ห่อ ต้องเหมือนกัน
        /// </summary>
        /// <param name="validateBarcodeRequest"></param>
        /// <returns>barcode มัดถูกต้อง</returns>
        /// <fail>barcode มัดไม่ถูกต้อง</fail>
        private async Task<ValidateBarcodeResponse?> ValidateBarcodeBundleAsync(
            ValidateBarcodeRequest validateBarcodeRequest)
        {
            var barcodeBundle = validateBarcodeRequest.ValidateBarcodeItem
                .FirstOrDefault(item => item.BarcodeType == BarcodeTypeConstants.BarcodeBundle);

            ValidateBarcodeResponse validateBarcodeResponse = new ValidateBarcodeResponse();
            if (barcodeBundle == null)
            {
                validateBarcodeResponse.IsValid = false;
                validateBarcodeResponse.ErrorMessage = string.Format(
                    ValidateBarcodeErrorMessage.ValidateTypeParameterNotFound,
                    BarcodeTypeConstants.BarcodeBundle);
                return validateBarcodeResponse;
            }

            if (!string.IsNullOrEmpty(barcodeBundle.BarcodeValue) && barcodeBundle.BarcodeValue is { Length: 24 })
            {
                var barcodeWrap = validateBarcodeRequest.ValidateBarcodeItem
                    .FirstOrDefault(item => item.BarcodeType == BarcodeTypeConstants.BarcodeWrap);

                if (barcodeWrap == null)
                {
                    validateBarcodeResponse.IsValid = false;
                    validateBarcodeResponse.ErrorMessage = string.Format(
                        ValidateBarcodeErrorMessage.ValidateTypeParameterNotFound,
                        BarcodeTypeConstants.BarcodeWrap);
                    return validateBarcodeResponse;
                }

                // Todo เอา 3 หลักแรก ไปเทียบกับ barcode ห่อ ต้องตรงกัน
                if (barcodeBundle.BarcodeValue[0] != barcodeWrap.BarcodeValue[0] ||
                    barcodeBundle.BarcodeValue[1] != barcodeWrap.BarcodeValue[1] ||
                    barcodeBundle.BarcodeValue[2] != barcodeWrap.BarcodeValue[2])
                {
                    validateBarcodeResponse.IsValid = false;
                    validateBarcodeResponse.ErrorMessage = ValidateBarcodeErrorMessage.BarcodeBundleValidateWrapFail;
                    return validateBarcodeResponse;
                }

                // Todo หลัก 4 - 6 ข้าม
                // Todo หลักที่ 7 ไป เทียบกับหลักที่ 7 ของ barcode ห่อ ต้องเหมือนกัน
                if (barcodeBundle.BarcodeValue[6] != barcodeWrap.BarcodeValue[6])
                {
                    validateBarcodeResponse.IsValid = false;
                    validateBarcodeResponse.ErrorMessage = ValidateBarcodeErrorMessage.BarcodeBundleValidateWrapFail;
                    return validateBarcodeResponse;
                }

                // Todo หลักที่ 8 ไป เทียบกับหลักที่ 8 ของ barcode ห่อ ต้องเหมือนกัน
                if (barcodeBundle.BarcodeValue[7] != barcodeWrap.BarcodeValue[7])
                {
                    validateBarcodeResponse.IsValid = false;
                    validateBarcodeResponse.ErrorMessage = ValidateBarcodeErrorMessage.BarcodeBundleValidateWrapFail;
                    return validateBarcodeResponse;
                }

                #region ValidateBarcodeBundleDuplicate

                if (validateBarcodeRequest.ValidateExistingInDatabase)
                {
                    var startTimeConfigs =
                        await _unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync(ConfigConstants.BSS_WORK_DAY);

                    // Todo barcode มัดต้องไม่ซ้ำภายในห่อนั้นๆ
                    var duplicatePrepare = await _unitOfWork.TransactionPreparationRepos
                        .CheckTransactionPreparationBarcodeIsDuplicateAsync(
                            validateBarcodeRequest.ContainerId,
                            barcodeWrap.BarcodeValue, barcodeBundle.BarcodeValue,
                            startTimeConfigs.ToScanPrepareBssWorkDayStartDateTime(),
                            startTimeConfigs.ToScanPrepareBssWorkDayEndDateTime());

                    if (duplicatePrepare != null)
                    {
                        validateBarcodeResponse.IsValid = false;
                        validateBarcodeResponse.ErrorMessage = ValidateBarcodeErrorMessage.BarcodeBundleDuplicate;
                        return validateBarcodeResponse;
                    }
                }

                #endregion ValidateBarcodeBundleDuplicate

                validateBarcodeResponse.IsValid = true;
                validateBarcodeResponse.ErrorMessage = ValidateBarcodeSuccessMessage.BarcodeBundleIsValid;
            }
            else
            {
                validateBarcodeResponse.IsValid = false;
                validateBarcodeResponse.ErrorMessage = ValidateBarcodeErrorMessage.BarcodeBundleFail;
            }

            return validateBarcodeResponse;
        }

        /// <summary>
        /// format เป็นตัวเลข และความยาวต้อง == 10 หลัก
        /// เลข header ต้องไม่มีใน database ถายใน 2 วันตาม setting
        /// </summary>
        /// <param name="validateBarcodeRequest"></param>
        /// <returns>header card ถูกต้อง</returns>
        /// <fail>header card ไม่ถูกต้อง</fail>
        private async Task<ValidateBarcodeResponse?> ValidateHeaderCardAsync(
            ValidateBarcodeRequest validateBarcodeRequest)
        {
            var headerCard = validateBarcodeRequest.ValidateBarcodeItem
                .FirstOrDefault(item => item.BarcodeType == BarcodeTypeConstants.HeaderCard);

            ValidateBarcodeResponse validateBarcodeResponse = new ValidateBarcodeResponse();
            if (headerCard == null)
            {
                validateBarcodeResponse.IsValid = false;
                validateBarcodeResponse.ErrorMessage = string.Format(
                    ValidateBarcodeErrorMessage.ValidateTypeParameterNotFound,
                    BarcodeTypeConstants.HeaderCard);
                return validateBarcodeResponse;
            }

            if (!string.IsNullOrEmpty(headerCard.BarcodeValue) &&
                headerCard.BarcodeValue is { Length: 10 } &&
                headerCard.BarcodeValue.All(char.IsDigit))
            {
                // Todo เลข header ต้องไม่มีใน database ถายใน 2
                // Todo ดูที่ตาราง bss_txn_container_prepare join กับ bss_txn_prepare ที่ column header_card_code
                // Todo where ด้วย department_id หรือ machine_id
                // Todo ภายใน 2 วัน คือ date now - 1 วัน เป้น start และ date now เป้น end และ where between กับ created_date
                // Todo ต้องไม่มีข้อมูลใน database

                // Todo ต้องมี parameter แค่อันใดอันนึง
                if (validateBarcodeRequest is { DepartmentId: not null, MachineId: not null } or
                    { DepartmentId: null, MachineId: null })
                {
                    validateBarcodeResponse.IsValid = false;
                    validateBarcodeResponse.ErrorMessage = ValidateBarcodeErrorMessage.ValidateTypeParameterInvalid;
                    return validateBarcodeResponse;
                }

                #region ValidateHeaderCardDuplicate

                if (validateBarcodeRequest.ValidateExistingInDatabase)
                {
                    TransactionPreparation? existingData = null;
                    var bssWorkDayConfigs =
                        await _unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync(ConfigConstants.BSS_CHECK_DUP_HC);

                    try
                    {
                        if (validateBarcodeRequest?.DepartmentId != null || validateBarcodeRequest?.MachineId != null)
                        {
                            existingData = await _unitOfWork.TransactionPreparationRepos
                                .ValidateHeaderCardIsExistingAsync(
                                    headerCard.BarcodeValue,
                                    bssWorkDayConfigs.ToValidateHeaderCardStartDateTime(),
                                    bssWorkDayConfigs.ToValidateHeaderCardEndDateTime(),
                                    departmentId: validateBarcodeRequest.DepartmentId,
                                    machineId: validateBarcodeRequest.MachineId
                                    );
                        }
                    }
                    catch (Exception ex)
                    {
                        validateBarcodeResponse.IsValid = false;
                        validateBarcodeResponse.ErrorMessage = ex.Message;
                    }

                    if (existingData != null)
                    {
                        validateBarcodeResponse.IsValid = false;
                        validateBarcodeResponse.ErrorMessage = ValidateBarcodeErrorMessage.HeaderCardIsDuplicate;
                        return validateBarcodeResponse;
                    }
                }

                #endregion ValidateHeaderCardDuplicate

                validateBarcodeResponse.IsValid = true;
                validateBarcodeResponse.ErrorMessage = ValidateBarcodeSuccessMessage.HeaderCardIsValid;
            }
            else
            {
                validateBarcodeResponse.IsValid = false;
                validateBarcodeResponse.ErrorMessage = ValidateBarcodeErrorMessage.HeaderCardFail;
            }

            return validateBarcodeResponse;
        }

        #endregion ValidateBarcodeImplementation
    }
}