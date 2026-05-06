namespace BSS_API.Services
{
    using Interface;
    using System.Data;
    using ReceiveCbms;
    using Core.Constants;
    using Newtonsoft.Json;
    using Models.Entities;
    using Models.ModelHelper;
    using Models.ObjectModels;
    using Models.RequestModels;
    using Core.CustomException;
    using Models.External.Request;
    using Models.External.Response;
    using BSS_API.Repositories.Interface;

    public class CbmsTransactionService(IUnitOfWork unitOfWork) : ICbmsTransactionService
    {
        #region ImportReceiveCbmsData

        public async Task<ReceiveCbmsDataResponse> ImportReceiveCbmsDataAsync(
            ReceiveCbmsDataRequest receiveCbmsDataRequest)
        {
            TransactionApiLog transactionApiLog = new TransactionApiLog();
            var response = await unitOfWork.ExecuteWithTransactionAsync<ReceiveCbmsDataResponse>(async () =>
            {
                ReceiveCbmsDataResponse result = new ReceiveCbmsDataResponse();
                await using var transaction = unitOfWork.ContextTransaction(IsolationLevel.ReadCommitted);

                try
                {
                    IReceiveCbmsObjectFactory receiveCbmsObjectFactory = new ReceiveCbmsObjectFactory(unitOfWork);
                    ConvertToReceiveCbmsDataTransactionResponse convertToReceiveCbmsDataTransactionResponse =
                        await receiveCbmsObjectFactory.ConvertToReceiveCbmsDataTransaction(receiveCbmsDataRequest);

                    #region InsertReceiveCbmsDataTransaction

                    if (convertToReceiveCbmsDataTransactionResponse.ReceiveCbmsDataTransactionNew.Count > 0)
                    {
                        await unitOfWork.CbmsTransactionRepos.AddManyAsync(convertToReceiveCbmsDataTransactionResponse
                            .ReceiveCbmsDataTransactionNew.ToList());
                    }

                    #endregion InsertReceiveCbmsDataTransaction

                    #region UpdateReceiveCbmsDataTransaction

                    if (convertToReceiveCbmsDataTransactionResponse.ReceiveCbmsDataTransactionDuplicate.Count > 0)
                    {
                        if (convertToReceiveCbmsDataTransactionResponse.BnTypeInput == BNTypeInputConstants.Unfit)
                        {
                            foreach (var duplicateCbmsData in convertToReceiveCbmsDataTransactionResponse
                                         .ReceiveCbmsDataTransactionDuplicate)
                            {
                                duplicateCbmsData.OldReceiveCbms.UpdatedDate = DateTime.Now;
                                unitOfWork.CbmsTransactionRepos.Update(duplicateCbmsData.OldReceiveCbms);
                            }
                        }
                        else if (convertToReceiveCbmsDataTransactionResponse.BnTypeInput == BNTypeInputConstants.UnSort)
                        {
                            // Todo เจอในระหว่างวัน check reconcile and update qty
                            // Todo is_reconcile ที่ prepare เป็น true คือ reconcile( กระทบยอดแล้ว )
                            // Todo status ที่ reconcile_tran Confirm = 19 ( ยืนยันผลนับคัด )
                            foreach (var duplicateCbmsData in convertToReceiveCbmsDataTransactionResponse
                                         .ReceiveCbmsDataTransactionDuplicate)
                            {
                                if (duplicateCbmsData.OldReceiveCbms.TransactionContainerPrepares.Count > 0)
                                {
                                    #region ValidateMultipleContainerPrepareIsActive

                                    if (duplicateCbmsData.OldReceiveCbms.TransactionContainerPrepares.Count(c =>
                                            c.IsActive == true) > 1)
                                    {
                                        //Todo found multiple container prepare active
                                        throw new ImportCbmsErrorException(string.Format(
                                            ImportCbmsResponseMessageConstants.MultipleContainerPrepareActive,
                                            duplicateCbmsData.OldReceiveCbms.ContainerId));
                                    }

                                    #endregion ValidateMultipleContainerPrepareIsActive

                                    #region AllContainerPrepareNotActive

                                    if (duplicateCbmsData.OldReceiveCbms.TransactionContainerPrepares.All(w =>
                                            w.IsActive == false))
                                    {
                                        // Todo เจอในระหว่างวันและมีข้อมูล container แต่ทุกตัวไม่ได้ใช้งานแล้ว
                                        // Todo นำ qty ที่ได้มาเขียนทับ qty และ remaining qty ในระบบ
                                        duplicateCbmsData.OldReceiveCbms.Qty = duplicateCbmsData.NewReceiveCbms.Qty;
                                        duplicateCbmsData.OldReceiveCbms.RemainingQty =
                                            duplicateCbmsData.NewReceiveCbms.RemainingQty;
                                        duplicateCbmsData.OldReceiveCbms.UpdatedDate = DateTime.Now;
                                    }

                                    #endregion AllContainerPrepareNotActive

                                    // Todo เจอในระหว่างวันและมีข้อมูล prepare ที่กำลังใช้งาน
                                    else if (duplicateCbmsData.OldReceiveCbms.TransactionContainerPrepares.Count(c =>
                                                 c.IsActive == true) == 1)
                                    {
                                        var currentContainerPrepare = duplicateCbmsData.OldReceiveCbms
                                            .TransactionContainerPrepares.First(w => w.IsActive == true);

                                        if (currentContainerPrepare.TransactionPreparation.Count > 0 &&
                                            currentContainerPrepare.TransactionPreparation.Any(a => a.IsActive == true))
                                        {
                                            if (currentContainerPrepare.TransactionPreparation.Any(p =>
                                                    p is
                                                    {
                                                        IsReconcile: true,
                                                        TransactionReconcileTran.StatusId: BssStatusConstants.Confirm
                                                    }))
                                            {
                                                // Todo มี prepare ที่มีการ confirm แล้ว
                                                // Todo ต้องนับมั๊ยว่า confirm ไปแล้วกี่ตัว ?
                                                int countConfirmed =
                                                    currentContainerPrepare.TransactionPreparation.Count(s =>
                                                        s.TransactionReconcileTran is
                                                            { StatusId: BssStatusConstants.Confirm });

                                                int preparedQty = duplicateCbmsData.OldReceiveCbms.Qty.Value -
                                                                  duplicateCbmsData.OldReceiveCbms.RemainingQty.Value;

                                                int realPrepared = preparedQty - countConfirmed;
                                                // Todo ต้องมากว่า จำนวนที่ prepare ไปแล้ว
                                                if (duplicateCbmsData.NewReceiveCbms.Qty < realPrepared)
                                                {
                                                    throw new ImportCbmsErrorException(
                                                        string.Format(
                                                            ImportCbmsResponseMessageConstants
                                                                .NewQTYIsLessThenPreparedInBSS,
                                                            currentContainerPrepare.ContainerCode,
                                                            duplicateCbmsData.NewReceiveCbms.Qty,
                                                            duplicateCbmsData.OldReceiveCbms.RemainingQty));
                                                }

                                                duplicateCbmsData.OldReceiveCbms.Qty =
                                                    duplicateCbmsData.NewReceiveCbms.Qty;
                                                duplicateCbmsData.OldReceiveCbms.RemainingQty =
                                                    (duplicateCbmsData.NewReceiveCbms.RemainingQty - preparedQty);
                                                duplicateCbmsData.OldReceiveCbms.UpdatedDate = DateTime.Now;
                                            }
                                            else
                                            {
                                                // Todo prepare แล้วแต่ยังไม่ confirm
                                                int preparedQty = duplicateCbmsData.OldReceiveCbms.Qty.Value -
                                                                  duplicateCbmsData.OldReceiveCbms.RemainingQty.Value;

                                                // Todo ต้องมากว่า จำนวนที่ prepare ไปแล้ว
                                                if (duplicateCbmsData.NewReceiveCbms.Qty < preparedQty)
                                                {
                                                    throw new ImportCbmsErrorException(
                                                        string.Format(
                                                            ImportCbmsResponseMessageConstants
                                                                .NewQTYIsLessThenPreparedInBSS,
                                                            currentContainerPrepare.ContainerCode,
                                                            duplicateCbmsData.NewReceiveCbms.Qty,
                                                            duplicateCbmsData.OldReceiveCbms.RemainingQty));
                                                }

                                                duplicateCbmsData.OldReceiveCbms.Qty =
                                                    duplicateCbmsData.NewReceiveCbms.Qty;
                                                duplicateCbmsData.OldReceiveCbms.RemainingQty =
                                                    (duplicateCbmsData.NewReceiveCbms.RemainingQty - preparedQty);
                                                duplicateCbmsData.OldReceiveCbms.UpdatedDate = DateTime.Now;
                                            }
                                        }
                                        else
                                        {
                                            // Todo มี container ที่กำลังใช้งาน แต่ไม่มี prepare หรือ prepare แล้วยกเลิก
                                            duplicateCbmsData.OldReceiveCbms.Qty = duplicateCbmsData.NewReceiveCbms.Qty;
                                            duplicateCbmsData.OldReceiveCbms.RemainingQty =
                                                duplicateCbmsData.NewReceiveCbms.RemainingQty;
                                            duplicateCbmsData.OldReceiveCbms.UpdatedDate = DateTime.Now;
                                        }
                                    }
                                }
                                else
                                {
                                    #region PrepareDataNotFound

                                    // Todo เจอในระหว่างวันและยังไม่มีข้อมูล prepare เลย
                                    // Todo นำ qty ที่ได้มาเขียนทับ qty และ remaining qty ในระบบ
                                    // Todo Pass
                                    duplicateCbmsData.OldReceiveCbms.Qty = duplicateCbmsData.NewReceiveCbms.Qty;
                                    duplicateCbmsData.OldReceiveCbms.RemainingQty =
                                        duplicateCbmsData.NewReceiveCbms.RemainingQty;
                                    duplicateCbmsData.OldReceiveCbms.UpdatedDate = DateTime.Now;

                                    #endregion PrepareDataNotFound
                                }

                                unitOfWork.CbmsTransactionRepos.Update(duplicateCbmsData.OldReceiveCbms);
                            }
                        }
                    }

                    #endregion UpdateReceiveCbmsDataTransaction

                    await unitOfWork.SaveChangeAsync();
                    await unitOfWork.CommitAsync(transaction);

                    #region TransactionApiLog

                    transactionApiLog.DepartmentId = convertToReceiveCbmsDataTransactionResponse.DepartmentId;
                    transactionApiLog.CreatedBy = receiveCbmsDataRequest.ConnectInfo.ServiceName;

                    #endregion #region TransactionApiLog

                    result.BSSResponse = new BSSResponse
                    {
                        IsSuccess = true,
                        MessageCode = ImportCbmsResponseCodeConstants.Success,
                        MessageDescription = ImportCbmsResponseMessageConstants.Success,
                        ConnectionInfo = receiveCbmsDataRequest.ConnectInfo
                    };
                }
                catch (ImportCbmsErrorException exception)
                {
                    await unitOfWork.RollbackAsync(transaction);
                    result.BSSResponse = new BSSResponse
                    {
                        IsSuccess = false,
                        MessageDescription = exception.Message,
                        ConnectionInfo = receiveCbmsDataRequest.ConnectInfo,
                        MessageCode = ImportCbmsResponseCodeConstants.ImportError
                    };
                }
                catch (ImportCbmsParameterException exception)
                {
                    await unitOfWork.RollbackAsync(transaction);
                    result.BSSResponse = new BSSResponse
                    {
                        IsSuccess = false,
                        MessageDescription = exception.Message,
                        ConnectionInfo = receiveCbmsDataRequest.ConnectInfo,
                        MessageCode = ImportCbmsResponseCodeConstants.ParameterBadRequest
                    };
                }
                catch (Exception)
                {
                    await unitOfWork.RollbackAsync(transaction);
                    result.BSSResponse = new BSSResponse
                    {
                        IsSuccess = false,
                        ConnectionInfo = receiveCbmsDataRequest.ConnectInfo,
                        MessageCode = ImportCbmsResponseCodeConstants.ImportError,
                        MessageDescription = ImportCbmsResponseMessageConstants.FailedWithExceptionMessage
                    };
                }

                return result;
            });

            #region TransactionApiLog

            await unitOfWork.ExecuteWithTransactionAsync<TransactionApiLog>(async () =>
            {
                await using var apiLogTransaction = unitOfWork.ContextTransaction(IsolationLevel.ReadCommitted);
                try
                {
                    transactionApiLog.SystemCode = receiveCbmsDataRequest.ConnectInfo.SystemCode;
                    transactionApiLog.ServiceName = receiveCbmsDataRequest.ConnectInfo.ServiceName;
                    transactionApiLog.ApiRequest = JsonConvert.SerializeObject(receiveCbmsDataRequest);
                    transactionApiLog.ApiResponse = JsonConvert.SerializeObject(response);
                    transactionApiLog.ApiResult = response.BSSResponse.IsSuccess;
                    transactionApiLog.CreatedDate = DateTime.Now;

                    await unitOfWork.TransactionApiLogRepos.AddAsync(transactionApiLog);
                    await unitOfWork.SaveChangeAsync();
                    await unitOfWork.CommitAsync(apiLogTransaction);
                }
                catch (Exception)
                {
                    await unitOfWork.RollbackAsync(apiLogTransaction);
                }

                return transactionApiLog;
            });

            #endregion TransactionApiLog

            return response;
        }

        #endregion ImportReceiveCbmsData

        public async Task DeleteReceiveCbmsData(long Id)
        {
            var entity_row = await unitOfWork.CbmsTransactionRepos.GetAsync(u => u.ReceiveId == Id);

            if (entity_row != null)
            {
                unitOfWork.CbmsTransactionRepos.Remove(entity_row);
                await unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<IEnumerable<TransactionReceiveCbmsViewData>> GetAllReceiveCbmsDataAsync(int department)
        {
            return await unitOfWork.CbmsTransactionRepos.GetAllReceiveCbmsDataAsync(department);
        }

        public async Task<ReceiveCbmsDataTransaction> GetReceiveCbmsDataByIdAsync(long receiveId)
        {
            return await unitOfWork.CbmsTransactionRepos.GetReceiveCbmsDataByIdAsync(receiveId);
        }

        public async Task UpdateReceiveCbmsData(UpdateTransactionReceiveCbmsDataRequest entity)
        {
            var entity_row =
                await unitOfWork.CbmsTransactionRepos.GetAsync(item => item.ReceiveId == entity.ReceiveId);
            entity_row.DepartmentId = entity.DepartmentId;
            entity_row.InstitutionId = entity.InstitutionId;
            entity_row.DenominationId = entity.DenominationId;
            entity_row.BnTypeInput = entity.BnTypeInput.Trim();
            entity_row.BarCode = entity.BarCode.Trim();
            entity_row.ContainerId = entity.ContainerId.Trim();
            entity_row.SendDate = DateTime.Now;
            entity_row.Qty = entity.Qty;
            entity_row.RemainingQty = entity.RemainingQty;
            entity_row.UnfitQty = entity.UnfitQty;
            entity_row.CbBdcCode = entity.CbBdcCode.Trim();
            entity_row.UpdatedBy = entity.UpdatedBy;
            entity_row.UpdatedDate = DateTime.Now;


            unitOfWork.CbmsTransactionRepos.Update(entity_row);
            await unitOfWork.SaveChangeAsync();
        }

        public async Task<IEnumerable<TransactionReceiveCbmsViewData>> CheckReceiveCbmsTransactionAsync(
            CheckReceiveCbmsTransactionRequest request)
        {
            // Todo add start date and end date
            var bssWorkDayConfigs = await unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync(ConfigConstants.BSS_WORK_DAY);
            request.DateTimeStart = bssWorkDayConfigs.ToScanPrepareBssWorkDayStartDateTime();
            request.DateTimeEnd = bssWorkDayConfigs.ToScanPrepareBssWorkDayEndDateTime();
            return await unitOfWork.CbmsTransactionRepos.CheckReceiveCbmsTransactionAsync(request);
        }

        public async Task ReceiveCbmsIncreaseRemainingQtyAsync(UpdateRemainingQtyRequest request)
        {
            await unitOfWork.CbmsTransactionRepos.ReceiveCbmsIncreaseRemainingQtyAsync(request);
        }

        public async Task ReceiveCbmsReduceRemainingQtyAsync(UpdateRemainingQtyRequest request)
        {
            await unitOfWork.CbmsTransactionRepos.ReceiveCbmsReduceRemainingQtyAsync(request);
        }

        public async Task<IEnumerable<TransactionReceiveCbmsViewData>> GetReceiveCbmsDataTransactionsWithConditionAsync(
            GetReceiveCbmsTransactionWithConditionRequest request)
        {
            var bssWorkDayConfigs =
                (await unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync(ConfigConstants.BSS_WORK_DAY));

            request.SendDateFrom = bssWorkDayConfigs.ToScanPrepareBssWorkDayStartDateTime();
            request.SendDateTo = bssWorkDayConfigs.ToScanPrepareBssWorkDayEndDateTime();

            var result = await unitOfWork
                .CbmsTransactionRepos
                .GetReceiveCbmsDataTransactionsWithConditionAsync(request);

            // TODO: Uncomment ตรวจสอบ InstitutionId กับ CbBdcCode
            foreach (var item in result)
            {
                if (request.BnTypeInput == BNTypeCodeConstants.UnsortCANonMember)
                {
                    if (string.IsNullOrEmpty(item.CbBdcCode) || item.CbBdcCode.Length < 3 || item.CbBdcCode[0] == '4' ||
                        !char.IsDigit(item.CbBdcCode[1]) || !char.IsDigit(item.CbBdcCode[2]))
                    {
                        throw new Exception("ไม่ใช่ธนบัตร Unsort CA Non Member");
                    }
                }

                var companyId = request.CompanyId ?? throw new ArgumentNullException(nameof(request.CompanyId));
                var companyInst =
                    await unitOfWork.CompanyInstitutionRepos.GetByInstitutionByInstIdAsync(companyId,
                        item.InstitutionId);
                if (companyInst == null)
                {
                    var masterInst =
                        await unitOfWork.InstitutionRepos.GetMasterInstitutionByInstIdAsync(item.InstitutionId);
                    if (masterInst == null)
                        throw new Exception(
                            $"ไม่พบธนาคาร {nameof(item.InstitutionId)}:{item.InstitutionId} ในฐานข้อมูลของระบบ");
                    throw new Exception($"ไม่พบธนาคาร {masterInst.InstitutionShortName} ในฐานข้อมูลของระบบ");
                }
            }


            return result;
        }

        public async Task<IEnumerable<TransactionReceiveCbmsViewData>> ValidateCbmsDataAsync(
            ValidateCbmsDataRequest request)
        {
            try
            {
                var bssWorkDayConfigs =
                    (await unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync(ConfigConstants.BSS_DAY));

                request.SendDateFrom = bssWorkDayConfigs.ToBssWorkDayStartDateTime();
                request.SendDateTo = bssWorkDayConfigs.ToBssWorkDayEndDateTime();

                var result = await unitOfWork.CbmsTransactionRepos.ValidateCbmsDataAsync(request);
                foreach (var item in result)
                {
                    // step 1 
                    //  ca non member != 4
                    //  ca non member = 4

                    if (!MatchCbBdcByType(request.ValidateType, item.CbBdcCode))
                        throw new Exception(GetValidateMessage(request.ValidateType));

                    // step 2: company + inst  
                    var companyInst = await unitOfWork.CompanyInstitutionRepos
                        .GetByInstitutionByInstIdAsync(request.CompanyId, item.InstitutionId);

                    if (companyInst == null)
                    {
                        var masterInst = await unitOfWork.InstitutionRepos
                            .GetMasterInstitutionByInstIdAsync(item.InstitutionId);

                        if (masterInst == null)
                            throw new Exception($"ไม่พบธนาคาร InstitutionId:{item.InstitutionId} ในฐานข้อมูลของระบบ");

                        throw new Exception($"ไม่พบธนาคาร {masterInst.InstitutionShortName} ในฐานข้อมูลของระบบ");
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        private static bool IsDigitCheck(string? code, char prefix)
        {
            if (string.IsNullOrWhiteSpace(code)) return false;

            var s = code.Trim();
            return s.Length >= 3
                   && s[0] == prefix
                   && char.IsDigit(s[1])
                   && char.IsDigit(s[2]);
        }

        private static bool MatchCbBdcByType(string validateType, string? cbBdcCode)
        {
            var type = (validateType ?? string.Empty).Trim().ToUpperInvariant();

            return type switch
            {
                "CA_MEMBER" => IsDigitCheck(cbBdcCode, '4'),
                "CA_NON_MEMBER" => !IsDigitCheck(cbBdcCode, '4'),
                _ => true
            };
        }

        private static readonly Dictionary<string, string> ErrorMessageMap = new()
        {
            { "CA_MEMBER", "ไม่ใช่ธนบัตร Unsort CA Member" },
            { "CA_NON_MEMBER", "ไม่ใช่ธนบัตร Unsort CA Non Member" }
        };

        private static string GetValidateMessage(string key)
        {
            return ErrorMessageMap.TryGetValue(key, out var msg)
                ? msg
                : "เกิดข้อผิดพลาด";
        }
    }
}