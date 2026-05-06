namespace BSS_API.Services
{
    using Helpers;
    using Interface;
    using Core.Constants;
    using Models.Entities;
    using Models.ModelHelper;
    using Core.CustomException;
    using Models.RequestModels;
    using Models.ResponseModels;
    using BSS_API.Repositories.Interface;

    public class TransactionSendUnsortCCService(IUnitOfWork unitOfWork) : ITransactionSendUnsortCCService
    {
        public async Task<CreateSendUnsortResponse> LoadRegisterUnsortListAsync(
            LoadRegisterUnsortRequest loadRegisterUnsortRequest,
            CancellationToken ct = default)
        {
            try
            {
                CreateSendUnsortResponse createSendUnsortResponse = new CreateSendUnsortResponse();
                var allRegisterUnsort = (await unitOfWork.TransactionRegisterUnsortRepos
                    .GetRegisterUnsortDetailsForCreateSendUnsortAsync(
                        loadRegisterUnsortRequest.DepartmentId,
                        loadRegisterUnsortRequest.StartDate, loadRegisterUnsortRequest.EndDate, ct)).ToList();

                createSendUnsortResponse.ContaineCode =
                    allRegisterUnsort.Select(x => x.ContainerCode).Distinct().ToList();

                createSendUnsortResponse.RegisterUnsort =
                    allRegisterUnsort.OrderByDescending(w => w.CreatedDate).ToList();
                return createSendUnsortResponse;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<CreateSendUnsortCCRequest> CreateSendUnsortAsync(CreateSendUnsortCCRequest request,
            CancellationToken ct = default)
        {
            try
            {
                if (request.RegisterUnsortId.Count == 0)
                {
                    throw new Exception("register unsort id is empty");
                }

                #region ValidateDeliveryCodeDuplicate

                if (await unitOfWork.TransactionSendUnsortCCRepos.CheckSendUnsortCCExistWithDeliveryCodeAsync(
                        request.DeliveryCode))
                {
                    throw new DeliveryCodeDuplicateException(
                        "รหัสใบนำส่งนี้มีอยู่แล้ว คุณต้องการสร้างรหัสใบนำส่งใหม่ ?");
                }

                #endregion ValidateDeliveryCodeDuplicate

                TransactionSendUnsortCC transactionSendUnsortCC = new TransactionSendUnsortCC
                {
                    DepartmentId = request.DepartmentId,
                    SendUnsortCode = request.DeliveryCode,
                    Remark = null,
                    RefCode = RefCodeGenerator.GenerateRefCode(RefCodeLengthConstants.RefCodeLength),
                    OldRefCode = null,
                    StatusId = BssStatusConstants.DeliveredNote,
                    IsActive = true,
                    SendDate = null,
                    ReceivedDate = null,
                    CreatedBy = request.CreatedBy,
                    CreatedDate = DateTime.Now,
                    UpdatedBy = null,
                    UpdatedDate = null,
                    TransactionSendUnsortData = new List<TransactionSendUnsortData>()
                };

                foreach (var registerUnsortId in request.RegisterUnsortId)
                {
                    var registerUnsort =
                        await unitOfWork.TransactionRegisterUnsortRepos.GetAsync(
                            w => w.RegisterUnsortId == registerUnsortId, tracked: true);

                    if (registerUnsort == null)
                    {
                        throw new Exception("Register Unsort not found.");
                    }

                    registerUnsort.StatusId = BssStatusConstants.DeliveredNote;
                    registerUnsort.UpdatedBy = request.CreatedBy;
                    registerUnsort.UpdatedDate = DateTime.Now;
                    unitOfWork.TransactionRegisterUnsortRepos.Update(registerUnsort);

                    transactionSendUnsortCC.TransactionSendUnsortData.Add(new TransactionSendUnsortData
                    {
                        RegisterUnsortId = registerUnsortId,
                        IsActive = true,
                        CreatedBy = request.CreatedBy,
                        CreatedDate = DateTime.Now,
                        UpdatedBy = null,
                        UpdatedDate = null
                    });
                }

                await unitOfWork.TransactionSendUnsortCCRepos.AddAsync(transactionSendUnsortCC);
                await unitOfWork.SaveChangeAsync();
                return request;
            }
            catch (Exception)
            {
                throw;
            }
        }


        public async Task<RegisterUnsortDeliverResponse> GetRegisterUnsortDeliverAsync(
            RegisterUnsortDeliverRequest registerUnsortDeliverRequest)
        {
            try
            {
                RegisterUnsortDeliverResponse registerUnsortDeliverResponses =
                    new RegisterUnsortDeliverResponse { DataIsHistory = false };

                if (registerUnsortDeliverRequest.IsSelectHistory)
                {
                    // Todo ถ้าเลือก filter status = Delivered (ส่งมอบ) จะดึงข้อมูลจากตาราง history
                    ICollection<int> statusIn = new List<int>
                    {
                        BssStatusConstants.Delivered, // ส่งมอบ
                    };

                    ICollection<TransactionSendUnsortCCHistory>? transactionSendUnsortCcHistories =
                        await unitOfWork.TransactionSendUnsortCCHistoryRepos
                            .GetSendUnsortCCHistoryForRegisterUnsortDeliverAsync(
                                registerUnsortDeliverRequest.DepartmentId, statusIn,
                                registerUnsortDeliverRequest.StartDate, registerUnsortDeliverRequest.EndDate);

                    if (transactionSendUnsortCcHistories != null)
                    {
                        registerUnsortDeliverResponses.DataIsHistory = true;
                        foreach (var transactionSendUnsortCcHistoryItem in transactionSendUnsortCcHistories)
                        {
                            RegisterSendUnsortCCResponse registerSendUnsortCCResponse = new RegisterSendUnsortCCResponse
                            {
                                HistorySendUnsortId = transactionSendUnsortCcHistoryItem.HisUnsortId,
                                SendUnsortId = transactionSendUnsortCcHistoryItem.SendUnsortId,
                                DepartmentId = transactionSendUnsortCcHistoryItem.DepartmentId,
                                SendUnsortCode = transactionSendUnsortCcHistoryItem.SendUnsortCode,

                                Remark = transactionSendUnsortCcHistoryItem.TransactionSendUnsortCC?.Remark,
                                StatusId = transactionSendUnsortCcHistoryItem.TransactionSendUnsortCC.StatusId,
                                MasterStatus = transactionSendUnsortCcHistoryItem.TransactionSendUnsortCC.MasterStatus,
                                SendDate = transactionSendUnsortCcHistoryItem.TransactionSendUnsortCC.SendDate,
                                ReceiveDate = transactionSendUnsortCcHistoryItem.TransactionSendUnsortCC.ReceivedDate,
                                IsActive = transactionSendUnsortCcHistoryItem.TransactionSendUnsortCC.IsActive,

                                CreatedBy = transactionSendUnsortCcHistoryItem.CreatedBy,
                                CreatedDate = transactionSendUnsortCcHistoryItem.CreatedDate,
                                UpdatedBy = transactionSendUnsortCcHistoryItem.UpdatedBy,
                                UpdatedDate = transactionSendUnsortCcHistoryItem.UpdatedDate,

                                #region ActionButton

                                CanEdit = false,
                                CanPrint = true, // history print ได้อย่างเดียว
                                CanDelete = false,

                                #endregion ActionButton

                                IsHistory = true
                            };

                            if (transactionSendUnsortCcHistoryItem.TransactionSendUnsortDataHistory is { Count: > 0 })
                            {
                                foreach (var transactionSendUnsortDataHistory in
                                         transactionSendUnsortCcHistoryItem.TransactionSendUnsortDataHistory)
                                {
                                    RegisterUnsortWithSumBankNoteQtyResponse registerUnsortWithSumBankNoteQtyResponse =
                                        new RegisterUnsortWithSumBankNoteQtyResponse
                                        {
                                            RegisterUnsortId = transactionSendUnsortDataHistory.RegisterUnsortId,
                                            ContainerCode =
                                                transactionSendUnsortDataHistory.TransactionRegisterUnsort?
                                                    .ContainerCode ?? string.Empty,
                                            CreatedDate = transactionSendUnsortDataHistory.TransactionRegisterUnsort
                                                ?.CreatedDate,
                                            TotalBanknoteQty = transactionSendUnsortDataHistory
                                                ?.TransactionUnsortCCHistorys != null
                                                ? transactionSendUnsortDataHistory
                                                    ?.TransactionUnsortCCHistorys
                                                    .Sum(x => x.BanknoteQty)
                                                : 0,

                                            MasterInstitution = transactionSendUnsortDataHistory
                                                .TransactionUnsortCCHistorys
                                                ?.Select(s => s.MasterInstitution).ToList()
                                        };

                                    registerSendUnsortCCResponse.RegisterUnsortWithSumBankNoteQty.Add(
                                        registerUnsortWithSumBankNoteQtyResponse);
                                }
                            }

                            registerUnsortDeliverResponses.RegisterSendUnsortCC.Add(registerSendUnsortCCResponse);
                        }
                    }
                }
                else
                {
                    ICollection<int> statusIn = new List<int>
                    {
                        BssStatusConstants.DeliveredNote, // สร้างใบส่งมอบ
                        BssStatusConstants.Delivered, // ส่งมอบ
                        BssStatusConstants.Returned, // ส่งคืน
                        BssStatusConstants.NotAccepted, // ไม่รับมอบ
                        BssStatusConstants.CorrectReturn // แก้ไขรายการส่งกลับ
                    };

                    ICollection<TransactionSendUnsortCC>? transactionSendUnsortCc =
                        await unitOfWork.TransactionSendUnsortCCRepos.GetSendUnsortCCForRegisterUnsortDeliverAsync(
                            registerUnsortDeliverRequest.DepartmentId, statusIn, registerUnsortDeliverRequest.StartDate,
                            registerUnsortDeliverRequest.EndDate);

                    if (transactionSendUnsortCc != null)
                    {
                        registerUnsortDeliverResponses.DataIsHistory = false;
                        foreach (var transactionSendUnsortCcItem in transactionSendUnsortCc)
                        {
                            RegisterSendUnsortCCResponse registerSendUnsortCCResponse = new RegisterSendUnsortCCResponse
                            {
                                HistorySendUnsortId = null,
                                SendUnsortId = transactionSendUnsortCcItem.SendUnsortId,
                                DepartmentId = transactionSendUnsortCcItem.DepartmentId,
                                SendUnsortCode = transactionSendUnsortCcItem.SendUnsortCode,
                                Remark = transactionSendUnsortCcItem.Remark,
                                StatusId = transactionSendUnsortCcItem.StatusId,
                                MasterStatus = transactionSendUnsortCcItem.MasterStatus,
                                SendDate = transactionSendUnsortCcItem.SendDate,
                                ReceiveDate = transactionSendUnsortCcItem.ReceivedDate,
                                IsActive = transactionSendUnsortCcItem.IsActive,
                                CreatedBy = transactionSendUnsortCcItem.CreatedBy,
                                CreatedDate = transactionSendUnsortCcItem.CreatedDate,
                                UpdatedBy = transactionSendUnsortCcItem.UpdatedBy,
                                UpdatedDate = transactionSendUnsortCcItem.UpdatedDate,

                                #region ActionButton

                                CanEdit = !BssStatusHelper.ToBssStatusEnum(transactionSendUnsortCcItem.StatusId)
                                    .HasFlag(BssStatusEnum.Delivered),
                                CanPrint = BssStatusHelper.ToBssStatusEnum(transactionSendUnsortCcItem.StatusId)
                                    .HasFlag(BssStatusEnum.Delivered),
                                CanDelete = !BssStatusHelper.ToBssStatusEnum(transactionSendUnsortCcItem.StatusId)
                                    .HasFlag(BssStatusEnum.Delivered),

                                #endregion ActionButton

                                IsHistory = false
                            };

                            if (transactionSendUnsortCcItem.TransactionSendUnsortData is { Count: > 0 })
                            {
                                foreach (var registerUnsortData in
                                         transactionSendUnsortCcItem.TransactionSendUnsortData)
                                {
                                    RegisterUnsortWithSumBankNoteQtyResponse registerUnsortWithSumBankNoteQtyResponse =
                                        new RegisterUnsortWithSumBankNoteQtyResponse
                                        {
                                            SendDataId = registerUnsortData.SendDataId,
                                            SendUnsortId = registerUnsortData.SendUnsortId,
                                            RegisterUnsortId = registerUnsortData.RegisterUnsortId,
                                            ContainerCode = registerUnsortData.TransactionRegisterUnsort != null
                                                ? registerUnsortData.TransactionRegisterUnsort.ContainerCode
                                                : string.Empty,
                                            CreatedDate = registerUnsortData.TransactionRegisterUnsort?.CreatedDate,
                                            TotalBanknoteQty = registerUnsortData.TransactionRegisterUnsort
                                                ?.TransactionUnsortCCs
                                                .Sum(x => x.BanknoteQty),

                                            MasterInstitution = registerUnsortData.TransactionRegisterUnsort
                                                ?.TransactionUnsortCCs.Select(s => s.MasterInstitution).ToList()
                                        };

                                    registerSendUnsortCCResponse.RegisterUnsortWithSumBankNoteQty.Add(
                                        registerUnsortWithSumBankNoteQtyResponse);
                                }
                            }

                            registerUnsortDeliverResponses.RegisterSendUnsortCC.Add(registerSendUnsortCCResponse);
                        }
                    }
                }

                #region GroupFilterData

                registerUnsortDeliverResponses.SendUnsortCode = registerUnsortDeliverResponses.RegisterSendUnsortCC
                    .Select(x => x.SendUnsortCode).Distinct().ToList();

                registerUnsortDeliverResponses.MasterInstitution = registerUnsortDeliverResponses
                    .RegisterSendUnsortCC
                    .SelectMany(x => x.RegisterUnsortWithSumBankNoteQty)
                    .SelectMany(x => x.MasterInstitution ?? null)
                    .DistinctBy(d => d.InstitutionId).ToList();

                if (!registerUnsortDeliverRequest.IsSelectHistory)
                {
                    registerUnsortDeliverResponses.MasterStatus = registerUnsortDeliverResponses.RegisterSendUnsortCC
                        .DistinctBy(g => g.MasterStatus?.StatusId).Select(s => s.MasterStatus).ToList();
                }

                #endregion GroupFilterData

                return registerUnsortDeliverResponses;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ConfirmRegisterUnsortDeliverRequest> ConfirmRegisterUnsortDeliverAsync(
            ConfirmRegisterUnsortDeliverRequest confirmRegisterUnsortDeliverRequest)
        {
            try
            {
                if (confirmRegisterUnsortDeliverRequest.RegisterSendUnsortCC.Count > 0)
                {
                    foreach (var registerSendUnsortCC in confirmRegisterUnsortDeliverRequest.RegisterSendUnsortCC)
                    {
                        #region ValidateFlowStatus

                        BssStatusEnum currentStatus = BssStatusHelper.ToBssStatusEnum(registerSendUnsortCC.StatusId);

                        // Todo status ของใบนำส่งต้องเป็น สร้างใบนำส่ง หรือ แก้ใขรายการส่งกลับ เท่านั้นถึงจะส่งมอบได้
                        if (!currentStatus.HasFlag(BssStatusEnum.DeliveredNote) &&
                            !currentStatus.HasFlag(BssStatusEnum.CorrectReturn))
                        {
                            throw new Exception("register unsort cc status is not valid");
                        }

                        #endregion ValidateFlowStatus

                        #region UpdateSendUnsortCC

                        // Todo update status ของ send unsort cc เป็น Delivered (ส่งมอบ) และ send date เป็น date now
                        var existingSendUnsortCc =
                            await unitOfWork.TransactionSendUnsortCCRepos
                                .GetTransactionSendUnsortCCAndIncludeDataBySendUnsortIdAsync(registerSendUnsortCC
                                    .SendUnsortId);

                        if (existingSendUnsortCc == null)
                        {
                            throw new Exception("send unsort cc not found");
                        }

                        // Todo ValidateRegisterUnsortBundle
                        if (existingSendUnsortCc.TransactionSendUnsortData is { Count: > 0 })
                        {
                            foreach (var sendUnsortData in existingSendUnsortCc.TransactionSendUnsortData)
                            {
                                if (sendUnsortData.TransactionRegisterUnsort is { TransactionUnsortCCs.Count: > 0 })
                                {
                                    if (sendUnsortData.TransactionRegisterUnsort.TransactionUnsortCCs.All(x =>
                                            x.BanknoteQty == 0))
                                        throw new BundleInvalidExceltion(
                                            "Warning: พบภาชนะที่มีจำนวนมัดไม่ถูกต้อง กรุณานำภาชนะออกจากใบนำส่ง");
                                }
                            }
                        }

                        existingSendUnsortCc.StatusId = BssStatusConstants.Delivered;
                        existingSendUnsortCc.SendDate = DateTime.Now;
                        existingSendUnsortCc.UpdatedBy = confirmRegisterUnsortDeliverRequest.CreatedBy;
                        existingSendUnsortCc.UpdatedDate = DateTime.Now;

                        #endregion UpdateSendUnsortCC

                        #region UpdateSendUnsortDataAndRegisterUnsort

                        // Todo loop send unsort data ของ send unsort cc เพื่อ update status ของ register unsort เป็น Delivered (ส่งมอบ)
                        if (existingSendUnsortCc.TransactionSendUnsortData is { Count: > 0 })
                        {
                            foreach (var sendUnsortData in existingSendUnsortCc.TransactionSendUnsortData)
                            {
                                sendUnsortData.UpdatedBy = confirmRegisterUnsortDeliverRequest.CreatedBy;
                                sendUnsortData.UpdatedDate = DateTime.Now;

                                if (sendUnsortData.TransactionRegisterUnsort != null)
                                {
                                    sendUnsortData.TransactionRegisterUnsort.StatusId = BssStatusConstants.Delivered;
                                    sendUnsortData.TransactionRegisterUnsort.UpdatedBy =
                                        confirmRegisterUnsortDeliverRequest.CreatedBy;
                                    sendUnsortData.TransactionRegisterUnsort.UpdatedDate = DateTime.Now;
                                }
                            }
                        }

                        #endregion UpdateSendUnsortDataRegisterUnsort

                        unitOfWork.TransactionSendUnsortCCRepos.Update(existingSendUnsortCc);

                        #region MapToHistory

                        // Todo select last old history for get old ref code
                        var oldSendUnsortCcHistory =
                            await unitOfWork.TransactionSendUnsortCCHistoryRepos
                                .GetLastTransactionSendUnsortCCHistoryBySendUnsortCCIdAsync(existingSendUnsortCc
                                    .SendUnsortId);

                        // Todo loop register unsort และ unsort cc เพื่อ map to history
                        var newSendUnsortCCHistory = new TransactionSendUnsortCCHistory
                        {
                            DepartmentId = confirmRegisterUnsortDeliverRequest.DepartmentId,
                            SendUnsortId = existingSendUnsortCc.SendUnsortId,
                            SendUnsortCode = existingSendUnsortCc.SendUnsortCode,
                            RefCode = existingSendUnsortCc.RefCode,
                            OldRefCode = oldSendUnsortCcHistory?.RefCode,
                            CreatedBy = confirmRegisterUnsortDeliverRequest.CreatedBy,
                            CreatedDate = DateTime.Now,
                            TransactionSendUnsortDataHistory = new List<TransactionSendUnsortDataHistory>(),
                        };

                        if (existingSendUnsortCc.TransactionSendUnsortData is { Count: > 0 })
                        {
                            foreach (var sendUnsortData in existingSendUnsortCc.TransactionSendUnsortData)
                            {
                                var newSendUnsortDataHistory = new TransactionSendUnsortDataHistory
                                {
                                    RegisterUnsortId = sendUnsortData.RegisterUnsortId,
                                    ContainerCode = sendUnsortData.TransactionRegisterUnsort?.ContainerCode ??
                                                    string.Empty,
                                    CreatedBy = confirmRegisterUnsortDeliverRequest.CreatedBy,
                                    CreatedDate = DateTime.Now,
                                    TransactionUnsortCCHistorys = new List<TransactionUnsortCCHistory>()
                                };

                                if (sendUnsortData.TransactionRegisterUnsort?.TransactionUnsortCCs is { Count: > 0 })
                                {
                                    foreach (var transactionUnsortCc in sendUnsortData.TransactionRegisterUnsort
                                                 .TransactionUnsortCCs)
                                    {
                                        newSendUnsortDataHistory.TransactionUnsortCCHistorys.Add(
                                            new TransactionUnsortCCHistory
                                            {
                                                InstId = transactionUnsortCc.InstId,
                                                DenoId = transactionUnsortCc.DenoId,
                                                BanknoteQty = transactionUnsortCc.BanknoteQty,
                                                RemainingQty = transactionUnsortCc.RemainingQty,
                                                CreatedBy = confirmRegisterUnsortDeliverRequest.CreatedBy,
                                                CreatedDate = DateTime.Now
                                            });
                                    }
                                }

                                newSendUnsortCCHistory.TransactionSendUnsortDataHistory.Add(newSendUnsortDataHistory);
                            }
                        }

                        await unitOfWork.TransactionSendUnsortCCHistoryRepos.AddAsync(newSendUnsortCCHistory);

                        #endregion MapToHistory
                    }
                }

                await unitOfWork.SaveChangeAsync();
                return confirmRegisterUnsortDeliverRequest;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ConfirmRegisterUnsortDeliverRequest> DeleteRegisterUnsortDeliverAsync(
            ConfirmRegisterUnsortDeliverRequest request)
        {
            try
            {
                var deleteRegisterUnsortDeliverRequest = request.RegisterSendUnsortCC.FirstOrDefault();
                if (deleteRegisterUnsortDeliverRequest != null)
                {
                    var deleteRegisterUnsortDeliver = await unitOfWork.TransactionSendUnsortCCRepos
                        .GetTransactionSendUnsortCCAndIncludeDataBySendUnsortIdAsync(deleteRegisterUnsortDeliverRequest
                            .SendUnsortId);

                    if (deleteRegisterUnsortDeliver == null)
                    {
                        throw new Exception("send unsort cc not found");
                    }

                    deleteRegisterUnsortDeliver.IsActive = false;
                    deleteRegisterUnsortDeliver.UpdatedBy = request.CreatedBy;
                    deleteRegisterUnsortDeliver.UpdatedDate = DateTime.Now;

                    if (deleteRegisterUnsortDeliver.TransactionSendUnsortData is { Count: > 0 })
                    {
                        foreach (var deleteSendUnsortData in deleteRegisterUnsortDeliver.TransactionSendUnsortData)
                        {
                            deleteSendUnsortData.IsActive = false;
                            deleteSendUnsortData.UpdatedBy = request.CreatedBy;
                            deleteSendUnsortData.UpdatedDate = DateTime.Now;

                            if (deleteSendUnsortData.TransactionRegisterUnsort != null)
                            {
                                deleteSendUnsortData.TransactionRegisterUnsort.StatusId = BssStatusConstants.Registered;
                                deleteSendUnsortData.TransactionRegisterUnsort.UpdatedBy = request.CreatedBy;
                                deleteSendUnsortData.TransactionRegisterUnsort.UpdatedDate = DateTime.Now;
                            }
                        }
                    }

                    unitOfWork.TransactionSendUnsortCCRepos.Update(deleteRegisterUnsortDeliver);
                }

                await unitOfWork.SaveChangeAsync();
                return request;
            }
            catch (Exception)
            {
                throw;
            }
        }

        #region EditSendUnsortDelivery

        public async Task<EditSendUnsortDeliveryResponse> GetEditSendUnsortDeliveryAsync(
            EditSendUnsortDeliveryRequest editSendUnsortDeliveryRequest)
        {
            try
            {
                EditSendUnsortDeliveryResponse editSendUnsortDeliveryResponse = new EditSendUnsortDeliveryResponse();

                #region LoadSelectedSendUnsortCC

                TransactionSendUnsortCC? transactionSendUnsortCC = await unitOfWork.TransactionSendUnsortCCRepos
                    .GetTransactionSendUnsortCCAndIncludeDataForEditSendUnsortDeliveryAsync(
                        editSendUnsortDeliveryRequest.SendUnsortId, editSendUnsortDeliveryRequest.DepartmentId);

                if (transactionSendUnsortCC == null)
                {
                    throw new Exception("send unsort cc not found");
                }

                editSendUnsortDeliveryResponse.SendUnsortId = transactionSendUnsortCC.SendUnsortId;
                editSendUnsortDeliveryResponse.SendUnsortCode = transactionSendUnsortCC.SendUnsortCode;
                editSendUnsortDeliveryResponse.StatusId = transactionSendUnsortCC.StatusId;

                if (transactionSendUnsortCC.TransactionSendUnsortData is { Count: > 0 })
                {
                    foreach (var transactionSendUnsortData in transactionSendUnsortCC.TransactionSendUnsortData)
                    {
                        SendUnsortDataResponse sendUnsortDataResponse = new SendUnsortDataResponse
                        {
                            SendDataId = transactionSendUnsortData.SendDataId,
                            SendUnsortId = transactionSendUnsortData.SendUnsortId,
                            RegisterUnsortId = transactionSendUnsortData.RegisterUnsortId,
                            ContainerCode = transactionSendUnsortData.TransactionRegisterUnsort?.ContainerCode ??
                                            string.Empty,
                            CreatedDate = transactionSendUnsortData.TransactionRegisterUnsort?.CreatedDate,
                            StatusId = transactionSendUnsortData.TransactionRegisterUnsort?.StatusId ?? 0,
                            StatusName =
                                transactionSendUnsortData.TransactionRegisterUnsort?.MasterStatus?.StatusNameTh,
                            IsOldData = true,
                            IsSelected = true,
                            UnsortCC = new List<EditSendUnsortDeliveryUnsortCCResponseDetail>()
                        };

                        if (transactionSendUnsortData.TransactionRegisterUnsort is { TransactionUnsortCCs.Count: > 0 })
                        {
                            foreach (var transactionUnsortCC in transactionSendUnsortData.TransactionRegisterUnsort
                                         .TransactionUnsortCCs)
                            {
                                EditSendUnsortDeliveryUnsortCCResponseDetail
                                    editSendUnsortDeliveryUnsortCcResponseDetail =
                                        new EditSendUnsortDeliveryUnsortCCResponseDetail
                                        {
                                            UnsortCCId = transactionUnsortCC.UnsortCCId,
                                            InstId = transactionUnsortCC.InstId,
                                            InstNameTh = transactionUnsortCC.MasterInstitution?.InstitutionNameTh ??
                                                         string.Empty,
                                            DenoId = transactionUnsortCC.DenoId,
                                            DenoPrice = transactionUnsortCC.MasterDenomination?.DenominationPrice
                                                .ToString() ?? string.Empty,
                                            BankNoteQty = transactionUnsortCC.BanknoteQty,
                                            CreatedDate = transactionUnsortCC.CreatedDate,
                                            IsActive = transactionUnsortCC.IsActive,
                                            CanEdit = true,
                                            CanDelete = true
                                        };

                                sendUnsortDataResponse.UnsortCC.Add(editSendUnsortDeliveryUnsortCcResponseDetail);
                            }
                        }

                        var oldStatus = BssStatusHelper.ToBssStatusEnum(sendUnsortDataResponse.StatusId);
                        sendUnsortDataResponse.CanEdit = oldStatus.HasFlag(BssStatusEnum.CorrectReturn) |
                                                         oldStatus.HasFlag(BssStatusEnum.Returned);
                        editSendUnsortDeliveryResponse.SendUnsortData.Add(sendUnsortDataResponse);
                    }
                }

                #endregion LoadSelectedSendUnsortCC

                // Todo ของใหม่จะ load ก็ต่อเมื่อ status ของ bss_txn_send_unsort_cc ข้างบนที่โหลด = สร้างใบนำส่ง
                if (editSendUnsortDeliveryResponse.StatusId == BssStatusConstants.DeliveredNote)
                {
                    ICollection<MasterConfig> configList =
                        await unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync(ConfigConstants.BSS_WORK_DAY);

                    DateTime startDate = editSendUnsortDeliveryRequest.StartDate ??
                                         configList.ToScanPrepareBssWorkDayStartDateTime();
                    DateTime endDate = editSendUnsortDeliveryRequest.EndDate ??
                                       configList.ToScanPrepareBssWorkDayEndDateTime();

                    ICollection<TransactionRegisterUnsort>? transactionRegisterUnsort =
                        await unitOfWork.TransactionRegisterUnsortRepos
                            .GetRegisterUnsortIncludeUnsortCCForEditSendUnsortCCAsync(
                                editSendUnsortDeliveryRequest.DepartmentId,
                                [BssStatusConstants.Registered], startDate, endDate);

                    if (transactionRegisterUnsort is { Count: > 0 })
                    {
                        foreach (var transactionRegisterUnsortItem in transactionRegisterUnsort)
                        {
                            SendUnsortDataResponse sendUnsortDataResponse = new SendUnsortDataResponse
                            {
                                SendDataId = null,
                                SendUnsortId = null,
                                RegisterUnsortId = transactionRegisterUnsortItem.RegisterUnsortId,
                                ContainerCode = transactionRegisterUnsortItem.ContainerCode,
                                CreatedDate = transactionRegisterUnsortItem.CreatedDate,
                                StatusId = transactionRegisterUnsortItem.StatusId,
                                StatusName = transactionRegisterUnsortItem.MasterStatus?.StatusNameTh,
                                IsOldData = false,
                                IsSelected = false,
                                UnsortCC = new List<EditSendUnsortDeliveryUnsortCCResponseDetail>()
                            };

                            if (transactionRegisterUnsortItem.TransactionUnsortCCs is { Count: > 0 })
                            {
                                foreach (var transactionUnsortCC in transactionRegisterUnsortItem.TransactionUnsortCCs)
                                {
                                    EditSendUnsortDeliveryUnsortCCResponseDetail
                                        editSendUnsortDeliveryUnsortCcResponseDetail =
                                            new EditSendUnsortDeliveryUnsortCCResponseDetail
                                            {
                                                UnsortCCId = transactionUnsortCC.UnsortCCId,
                                                InstId = transactionUnsortCC.InstId,
                                                InstNameTh = transactionUnsortCC.MasterInstitution?.InstitutionNameTh ??
                                                             string.Empty,
                                                DenoId = transactionUnsortCC.DenoId,
                                                DenoPrice = transactionUnsortCC.MasterDenomination?.DenominationPrice
                                                    .ToString() ?? string.Empty,
                                                BankNoteQty = transactionUnsortCC.BanknoteQty,
                                                CreatedDate = transactionUnsortCC.CreatedDate,
                                                IsActive = transactionUnsortCC.IsActive,
                                                CanEdit = true,
                                                CanDelete = true
                                            };

                                    sendUnsortDataResponse.UnsortCC.Add(editSendUnsortDeliveryUnsortCcResponseDetail);
                                }
                            }

                            var newStatus = BssStatusHelper.ToBssStatusEnum(sendUnsortDataResponse.StatusId);
                            sendUnsortDataResponse.CanEdit = newStatus.HasFlag(BssStatusEnum.CorrectReturn) |
                                                             newStatus.HasFlag(BssStatusEnum.Returned);
                            editSendUnsortDeliveryResponse.SendUnsortData.Add(sendUnsortDataResponse);
                        }
                    }
                }

                #region GroupFilterData

                if (editSendUnsortDeliveryResponse.StatusId == BssStatusConstants.DeliveredNote)
                {
                    editSendUnsortDeliveryResponse.BarcodeContainer = editSendUnsortDeliveryResponse.SendUnsortData
                        .Select(w => w.ContainerCode).Distinct().ToList();
                }

                #endregion GroupFilterData

                return editSendUnsortDeliveryResponse;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<EditSendUnsortDataBarcodeContainerRequest> EditBarcodeContainerSendUnsortDataAsync(
            EditSendUnsortDataBarcodeContainerRequest editSendUnsortDataBarcodeContainerRequest)
        {
            try
            {
                TransactionRegisterUnsort? transactionRegisterUnsort =
                    await unitOfWork.TransactionRegisterUnsortRepos.GetAsync(
                        w => w.RegisterUnsortId ==
                             editSendUnsortDataBarcodeContainerRequest.SendUnsortData.RegisterUnsortId &&
                             w.IsActive == true, tracked: true);

                if (transactionRegisterUnsort == null)
                {
                    throw new Exception("register unsort not found");
                }

                if (editSendUnsortDataBarcodeContainerRequest.SendUnsortData.ContainerCode.Trim() !=
                    transactionRegisterUnsort.ContainerCode.Trim())
                {
                    // Todo validate barcode container
                    BarcodeService.ValidateBarcodeServiceBuilder validateBarcodeBuilder =
                        new BarcodeService.ValidateBarcodeServiceBuilder()
                            .SetUnitOfWork(unitOfWork)
                            .SetValidateBarcodeRequest(new ValidateBarcodeRequest
                            {
                                ValidateExistingInDatabase = true,
                                BssBNTypeCode = BssBNTypeCodeConstants.RegisterUnsortCC,
                                ValidateBarcodeType = BarcodeTypeConstants.BarcodeContainer,
                                DepartmentId = editSendUnsortDataBarcodeContainerRequest.DepartmentId,
                                ValidateBarcodeItem = new List<ValidateBarcodeItem>()
                                {
                                    new()
                                    {
                                        BarcodeType = BarcodeTypeConstants.BarcodeContainer,
                                        BarcodeValue = editSendUnsortDataBarcodeContainerRequest.SendUnsortData
                                            .ContainerCode.TrimEnd()
                                    }
                                }
                            });

                    ValidateBarcodeResponse? validateBarcodeResponse =
                        await validateBarcodeBuilder.Build().ValidateAsync();
                    if (validateBarcodeResponse?.IsValid != true)
                        throw new BarcodeDuplicateException(string.Format(
                            ValidateBarcodeErrorMessage.BarcodeContainerDuplicate,
                            editSendUnsortDataBarcodeContainerRequest.SendUnsortData.ContainerCode));

                    // update new barcode container
                    transactionRegisterUnsort.ContainerCode =
                        editSendUnsortDataBarcodeContainerRequest.SendUnsortData.ContainerCode;
                    transactionRegisterUnsort.UpdatedBy = editSendUnsortDataBarcodeContainerRequest.UserId;
                    transactionRegisterUnsort.UpdatedDate = DateTime.Now;

                    await unitOfWork.SaveChangeAsync();
                }

                return editSendUnsortDataBarcodeContainerRequest;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ConfirmEditSendUnsortDeliveryRequest> ConfirmEditSendUnsortDeliveryAsync(
            ConfirmEditSendUnsortDeliveryRequest confirmEditSendUnsortDeliveryRequest)
        {
            try
            {
                TransactionSendUnsortCC? transactionSendUnsortCc =
                    await unitOfWork.TransactionSendUnsortCCRepos.GetAsync(
                        w => w.SendUnsortId == confirmEditSendUnsortDeliveryRequest.SendUnsortId, tracked: false);

                if (transactionSendUnsortCc == null)
                {
                    throw new Exception("send unsort cc not found");
                }

                // ถ้ารายการที่เลือก ไม่ใช่สถานะสร้างใบนำส่ง จะต้องเปลี่ยนสถานะเป็นแก้ใขรายการส่งกลับ
                if (confirmEditSendUnsortDeliveryRequest.StatusId != BssStatusConstants.DeliveredNote)
                {
                    transactionSendUnsortCc.StatusId = BssStatusConstants.CorrectReturn;
                    transactionSendUnsortCc.UpdatedBy = confirmEditSendUnsortDeliveryRequest.UserId;
                    transactionSendUnsortCc.UpdatedDate = DateTime.Now;
                }

                transactionSendUnsortCc.TransactionSendUnsortData = new List<TransactionSendUnsortData>();

                if (confirmEditSendUnsortDeliveryRequest.SendUnsortData is { Count: > 0 })
                {
                    List<ConfirmEditSendUnsortDataResponse> oldSelectedRegisterUnsort =
                        confirmEditSendUnsortDeliveryRequest.SendUnsortData.Where(x => x.IsOldData).ToList();

                    #region OldRegisterUnsort

                    foreach (var oldRegisterUnsort in oldSelectedRegisterUnsort)
                    {
                        TransactionRegisterUnsort? oldExistingTransactionRegisterUnsort =
                            await unitOfWork.TransactionRegisterUnsortRepos.GetAsync(
                                w => w.RegisterUnsortId == oldRegisterUnsort.RegisterUnsortId,
                                tracked: false);

                        // Todo หากมีรายการการเลือกภาชนะที่มีสถานะ"ลบข้อมูลภาชนะ" ให้เพิ่มแจ้งเตือนเมื่อกดยืนยันการแก้ไข
                        if (oldExistingTransactionRegisterUnsort == null || BssStatusHelper
                                .ToBssStatusEnum(oldExistingTransactionRegisterUnsort.StatusId)
                                .HasFlag(BssStatusEnum.DeletedPrePrepare))
                        {
                            throw new BundleInvalidExceltion(
                                "Warning: พบภาชนะที่มีจำนวนมัดไม่ถูกต้อง กรุณานำภาชนะออกจากใบนำส่ง");
                        }

                        // Todo ของเก่าและยังถูก select
                        if (oldRegisterUnsort.IsSelected)
                        {
                            // Todo update barcode container ถ้ามีการแก้ใขมาจากหน้าบ้าน
                            if (oldExistingTransactionRegisterUnsort.ContainerCode.TrimEnd() !=
                                oldRegisterUnsort.ContainerCode.TrimEnd())
                            {
                                // Todo validate barcode container
                                BarcodeService.ValidateBarcodeServiceBuilder validateBarcodeBuilder =
                                    new BarcodeService.ValidateBarcodeServiceBuilder()
                                        .SetUnitOfWork(unitOfWork)
                                        .SetValidateBarcodeRequest(new ValidateBarcodeRequest
                                        {
                                            ValidateExistingInDatabase = true,
                                            BssBNTypeCode = BssBNTypeCodeConstants.RegisterUnsortCC,
                                            ValidateBarcodeType = BarcodeTypeConstants.BarcodeContainer,
                                            DepartmentId = confirmEditSendUnsortDeliveryRequest.DepartmentId,
                                            ValidateBarcodeItem = new List<ValidateBarcodeItem>()
                                            {
                                                new()
                                                {
                                                    BarcodeType = BarcodeTypeConstants.BarcodeContainer,
                                                    BarcodeValue = oldRegisterUnsort.ContainerCode.TrimEnd()
                                                }
                                            }
                                        });

                                ValidateBarcodeResponse? validateBarcodeResponse =
                                    await validateBarcodeBuilder.Build().ValidateAsync();
                                if (validateBarcodeResponse?.IsValid != true)
                                    throw new BarcodeDuplicateException(string.Format(
                                        ValidateBarcodeErrorMessage.BarcodeContainerDuplicate,
                                        oldRegisterUnsort.ContainerCode));

                                oldExistingTransactionRegisterUnsort.ContainerCode = oldRegisterUnsort.ContainerCode;
                                oldExistingTransactionRegisterUnsort.UpdatedBy =
                                    confirmEditSendUnsortDeliveryRequest.UserId;
                                oldExistingTransactionRegisterUnsort.UpdatedDate = DateTime.Now;
                            }

                            // Todo update ข้อมูลธนบัตร
                            if (oldRegisterUnsort is { UnsortCC.Count: > 0 })
                            {
                                foreach (var oldUnsortCc in oldRegisterUnsort.UnsortCC)
                                {
                                    TransactionUnsortCC? oldExistingTransactionUnsortCc =
                                        await unitOfWork.TransactionUnsortCCRepos.GetAsync(
                                            w => w.UnsortCCId == oldUnsortCc.UnsortCCId && w.IsActive == true,
                                            tracked: false);

                                    if (oldExistingTransactionUnsortCc != null)
                                    {
                                        oldExistingTransactionUnsortCc.DenoId = oldUnsortCc.DenoId;
                                        oldExistingTransactionUnsortCc.InstId = oldUnsortCc.InstId;
                                        oldExistingTransactionUnsortCc.BanknoteQty = oldUnsortCc.BankNoteQty;
                                        oldExistingTransactionUnsortCc.RemainingQty = oldUnsortCc.BankNoteQty;
                                        oldExistingTransactionUnsortCc.IsActive = oldUnsortCc.IsActive;
                                        oldExistingTransactionUnsortCc.UpdatedBy =
                                            confirmEditSendUnsortDeliveryRequest.UserId;
                                        oldExistingTransactionUnsortCc.UpdatedDate = DateTime.Now;
                                        unitOfWork.TransactionUnsortCCRepos.Update(oldExistingTransactionUnsortCc);
                                    }
                                }
                            }

                            // Todo ของเก่ายังถูก select จะเปลี่ยนสถานะเป็นแก้ใขรายการส่งกลับ ถ้าใบนำส่งนั้นไม่ใช่สถานะ สร้างใบนำส่ง
                            if (confirmEditSendUnsortDeliveryRequest.StatusId !=
                                BssStatusConstants.DeliveredNote)
                            {
                                oldExistingTransactionRegisterUnsort.StatusId = BssStatusConstants.CorrectReturn;
                                oldExistingTransactionRegisterUnsort.UpdatedBy =
                                    confirmEditSendUnsortDeliveryRequest.UserId;
                                oldExistingTransactionRegisterUnsort.UpdatedDate = DateTime.Now;
                            }
                        }
                        // Todo register unsort ของเก่าแต่ถูกติ๊กออกจากใบนำส่ง
                        // Todo จะคืนสถานะลงทะเบียนให้ register unsort และลบ send unsort data ออกจากใบส่ง
                        else if (!oldRegisterUnsort.IsSelected)
                        {
                            // Todo ของเก่าไม่ถูก select ให้ลบ send unsort data และ update status register unsort ให้เป็นลงทะเบียน
                            TransactionSendUnsortData? oldExistingTransactionSendUnsortData =
                                await unitOfWork.TransactionSendUnsortDataRepos.GetAsync(
                                    w => w.RegisterUnsortId == oldRegisterUnsort.RegisterUnsortId && w.IsActive == true,
                                    tracked: false);

                            if (oldExistingTransactionSendUnsortData == null)
                            {
                                throw new Exception("send unsort data not found");
                            }

                            // Todo delete send unsort data
                            oldExistingTransactionSendUnsortData.IsActive = false;
                            oldExistingTransactionSendUnsortData.UpdatedBy =
                                confirmEditSendUnsortDeliveryRequest.UserId;
                            oldExistingTransactionSendUnsortData.UpdatedDate = DateTime.Now;
                            unitOfWork.TransactionSendUnsortDataRepos.Update(oldExistingTransactionSendUnsortData);

                            // Todo ถ้าในภาชนะแก้ใขจำนวน banknote_qty เป็น 0 ทั้งหมด
                            if (oldRegisterUnsort.UnsortCC.All(x => x.BankNoteQty == 0))
                            {
                                // Todo ลบภาชนะด้วยถ้า user ไม่ select
                                oldExistingTransactionRegisterUnsort.IsActive = false;
                                oldExistingTransactionRegisterUnsort.StatusId = BssStatusConstants.DeletedPrePrepare;
                                oldExistingTransactionRegisterUnsort.UpdatedBy =
                                    confirmEditSendUnsortDeliveryRequest.UserId;
                                oldExistingTransactionRegisterUnsort.UpdatedDate = DateTime.Now;
                            }
                            else
                            {
                                // Todo update register unsort status
                                oldExistingTransactionRegisterUnsort.StatusId = BssStatusConstants.Registered;
                                oldExistingTransactionRegisterUnsort.UpdatedBy =
                                    confirmEditSendUnsortDeliveryRequest.UserId;
                                oldExistingTransactionRegisterUnsort.UpdatedDate = DateTime.Now;
                            }
                        }

                        unitOfWork.TransactionRegisterUnsortRepos.Update(oldExistingTransactionRegisterUnsort);
                    }

                    #endregion OldRegisterUnsort

                    #region NewRegisterUnsort

                    // Todo ถ้าสถานะเป็น สร้างใบนำส่ง user จะสามารถเลือกเพิ่ม new register unsort ได้
                    // Todo ถ้าสถานะเป็น สร้างใบนำส่ง จะไม่ update สถานะของ send unsort และ register unsort ยกเว้น no selected
                    if (confirmEditSendUnsortDeliveryRequest.StatusId == BssStatusConstants.DeliveredNote)
                    {
                        List<ConfirmEditSendUnsortDataResponse> newSelectedRegisterUnsort =
                            confirmEditSendUnsortDeliveryRequest.SendUnsortData.Where(x => !x.IsOldData)
                                .ToList();

                        foreach (var newRegisterUnsort in newSelectedRegisterUnsort)
                        {
                            // Todo ของเก่ายังถูก select ไม่ update status แต่ check update barcode container และ update รายการธนบัตร
                            TransactionRegisterUnsort? newExistingTransactionRegisterUnsort =
                                await unitOfWork.TransactionRegisterUnsortRepos.GetAsync(
                                    w => w.RegisterUnsortId == newRegisterUnsort.RegisterUnsortId && w.IsActive == true,
                                    tracked: false);

                            if (newExistingTransactionRegisterUnsort == null)
                            {
                                throw new Exception("register unsort not found");
                            }

                            // Todo ของใหม่และถูก select
                            if (newRegisterUnsort.IsSelected)
                            {
                                // Todo validate barcode container
                                if (newExistingTransactionRegisterUnsort.ContainerCode.TrimEnd() !=
                                    newRegisterUnsort.ContainerCode.TrimEnd())
                                {
                                    BarcodeService.ValidateBarcodeServiceBuilder validateBarcodeBuilder =
                                        new BarcodeService.ValidateBarcodeServiceBuilder()
                                            .SetUnitOfWork(unitOfWork)
                                            .SetValidateBarcodeRequest(new ValidateBarcodeRequest
                                            {
                                                ValidateExistingInDatabase = true,
                                                BssBNTypeCode = BssBNTypeCodeConstants.RegisterUnsortCC,
                                                ValidateBarcodeType = BarcodeTypeConstants.BarcodeContainer,
                                                DepartmentId = confirmEditSendUnsortDeliveryRequest.DepartmentId,
                                                ValidateBarcodeItem = new List<ValidateBarcodeItem>()
                                                {
                                                    new()
                                                    {
                                                        BarcodeType = BarcodeTypeConstants.BarcodeContainer,
                                                        BarcodeValue = newRegisterUnsort.ContainerCode.TrimEnd()
                                                    }
                                                }
                                            });

                                    ValidateBarcodeResponse? validateBarcodeResponse =
                                        await validateBarcodeBuilder.Build().ValidateAsync();
                                    if (validateBarcodeResponse?.IsValid != true)
                                        throw new BarcodeDuplicateException(string.Format(
                                            ValidateBarcodeErrorMessage.BarcodeContainerDuplicate,
                                            newRegisterUnsort.ContainerCode));

                                    newExistingTransactionRegisterUnsort.ContainerCode =
                                        newRegisterUnsort.ContainerCode;
                                }

                                // Todo update ข้อมูลธนบัตร
                                if (newRegisterUnsort is { UnsortCC.Count: > 0 })
                                {
                                    foreach (var oldUnsortCc in newRegisterUnsort.UnsortCC)
                                    {
                                        TransactionUnsortCC? oldExistingTransactionUnsortCc =
                                            await unitOfWork.TransactionUnsortCCRepos.GetAsync(
                                                w => w.UnsortCCId == oldUnsortCc.UnsortCCId && w.IsActive == true,
                                                tracked: false);

                                        if (oldExistingTransactionUnsortCc != null)
                                        {
                                            oldExistingTransactionUnsortCc.DenoId = oldUnsortCc.DenoId;
                                            oldExistingTransactionUnsortCc.InstId = oldUnsortCc.InstId;
                                            oldExistingTransactionUnsortCc.BanknoteQty = oldUnsortCc.BankNoteQty;
                                            oldExistingTransactionUnsortCc.RemainingQty = oldUnsortCc.BankNoteQty;
                                            oldExistingTransactionUnsortCc.IsActive = oldUnsortCc.IsActive;
                                            oldExistingTransactionUnsortCc.UpdatedBy =
                                                confirmEditSendUnsortDeliveryRequest.UserId;
                                            oldExistingTransactionUnsortCc.UpdatedDate = DateTime.Now;
                                            unitOfWork.TransactionUnsortCCRepos.Update(oldExistingTransactionUnsortCc);
                                        }
                                    }
                                }

                                // Todo update register unsort status ให้เป็น สร้างใบนำส่ง
                                newExistingTransactionRegisterUnsort.StatusId =
                                    BssStatusConstants.DeliveredNote; // สร้างใบส่งมอบ
                                newExistingTransactionRegisterUnsort.UpdatedBy =
                                    confirmEditSendUnsortDeliveryRequest.UserId;
                                newExistingTransactionRegisterUnsort.UpdatedDate = DateTime.Now;

                                // Todo สร้าง send unsort data ของ register unsort ตัวที่ถูก select และเพิ่มเข้าไปใน send unsort cc
                                TransactionSendUnsortData newTransactionSendUnsortData =
                                    new TransactionSendUnsortData
                                    {
                                        SendUnsortId = confirmEditSendUnsortDeliveryRequest.SendUnsortId,
                                        RegisterUnsortId = newExistingTransactionRegisterUnsort.RegisterUnsortId,
                                        CreatedDate = DateTime.Now,
                                        CreatedBy = confirmEditSendUnsortDeliveryRequest.UserId,
                                        IsActive = true
                                    };

                                transactionSendUnsortCc.TransactionSendUnsortData.Add(newTransactionSendUnsortData);
                            }
                            else if (!newRegisterUnsort.IsSelected)
                            {
                                // Todo ของใหม่แต่ไม่ถูก select ให้ข้ามการทำงาน
                            }

                            unitOfWork.TransactionRegisterUnsortRepos.Update(newExistingTransactionRegisterUnsort);
                        }
                    }

                    #endregion NewRegisterUnsort
                }

                unitOfWork.TransactionSendUnsortCCRepos.Update(transactionSendUnsortCc);
                await unitOfWork.SaveChangeAsync();
                unitOfWork.ClearChangeTracker();

                #region ValidateAllSendUnsortDataIsDelete

                TransactionSendUnsortCC? validateDeleteTransactionSendUnsortCc =
                    await unitOfWork.TransactionSendUnsortCCRepos
                        .GetTransactionSendUnsortCCAndIncludeDataBySendUnsortIdAsync(
                            confirmEditSendUnsortDeliveryRequest.SendUnsortId);

                if (validateDeleteTransactionSendUnsortCc is { TransactionSendUnsortData.Count: 0 })
                {
                    // Todo delete send unsort cc if not have any send unsort data
                    validateDeleteTransactionSendUnsortCc.IsActive = false;
                    validateDeleteTransactionSendUnsortCc.StatusId = BssStatusConstants.Finished;
                    validateDeleteTransactionSendUnsortCc.UpdatedBy = confirmEditSendUnsortDeliveryRequest.UserId;
                    validateDeleteTransactionSendUnsortCc.UpdatedDate = DateTime.Now;

                    unitOfWork.TransactionSendUnsortCCRepos.Update(validateDeleteTransactionSendUnsortCc);
                    await unitOfWork.SaveChangeAsync();
                }

                #endregion ValidateAllSendUnsortDataIsDelete

                return confirmEditSendUnsortDeliveryRequest;
            }
            catch (Exception)
            {
                throw;
            }
        }

        #endregion EditSendUnsortDelivery
    }
}