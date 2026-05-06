namespace BSS_API.Services
{
    using Interface;
    using Core.Constants;
    using Models.Entities;
    using Models.ModelHelper;
    using Core.CustomException;
    using Models.RequestModels;
    using Models.ResponseModels;
    using BSS_API.Repositories.Interface;

    public class TransactionRegisterUnsortService(IUnitOfWork unitOfWork) : ITransactionRegisterUnsortService
    {
        public async Task<List<RegisterUnsortResponse>> LoadRegisterUnsortList(int departmentId,
            CancellationToken ct = default)
        {
            var configs =
                (await unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync(ConfigConstants.BSS_WORK_DAY));

            var startDateTime = configs.ToScanPrepareBssWorkDayStartDateTime();
            var endDateTime = configs.ToScanPrepareBssWorkDayEndDateTime();

            var data = (await unitOfWork.TransactionRegisterUnsortRepos.GetRegisterUnsortDetailsAsync(departmentId,
                startDateTime, endDateTime, ct)).ToList();

            foreach (var ru in data)
            {
                bool isHasPreparing = false;
                var isRegistered = ru.StatusId == BssStatusConstants.Registered; // ลงทะเบียน
                var isReceived = ru.StatusId == BssStatusConstants.Received; // รับมอบ

                if (ru.UnsortCC is { Count: > 0 })
                {
                    foreach (var cc in ru.UnsortCC)
                    {
                        bool isPreparing = false;

                        // Todo check unsort cc is has preparing
                        if (!isPreparing)
                        {
                            isPreparing = await unitOfWork.TransactionPreparationRepos.GetAsync(
                                w => w.TransactionUnsortCCId == cc.UnsortCCId && w.IsActive == true,
                                tracked: false) != null;

                            if (isPreparing)
                            {
                                isHasPreparing = isPreparing;
                            }
                        }

                        if (isRegistered)
                        {
                            // ลงทะเบียน
                            cc.CanEdit = true;
                            cc.CanDelete = true;
                        }
                        else if (isReceived)
                        {
                            // รับมอบ
                            cc.CanEdit = (!isPreparing && cc.RemainingQty > 0);
                            cc.CanDelete = !isPreparing;
                        }
                        else
                        {
                            cc.CanEdit = false;
                            cc.CanDelete = false;
                        }
                    }
                }

                if (isRegistered)
                {
                    ru.CanEdit = isRegistered;
                    ru.CanDelete = isRegistered;
                }
                else if (isReceived)
                {
                    ru.CanEdit = isReceived && !isHasPreparing;
                    ru.CanDelete = isReceived && !isHasPreparing;
                }
                else
                {
                    ru.CanEdit = false;
                    ru.CanDelete = false;
                }

                ru.CanPrint = isRegistered;
            }

            return data;
        }

        public async Task<TransactionRegisterUnsort?> ConfirmRegisterUnsortCCAsync(
            ConfirmRegisterUnsortRequest request,
            CancellationToken ct = default)
        {
            TransactionRegisterUnsort? transactionRegisterUnsort = null;
            if (request.id == null && request.isActive)
            {
                #region ValidateDuplicateContainerCode

                // Todo validate barcode container
                BarcodeService.ValidateBarcodeServiceBuilder validateBarcodeBuilder =
                    new BarcodeService.ValidateBarcodeServiceBuilder()
                        .SetUnitOfWork(unitOfWork)
                        .SetValidateBarcodeRequest(new ValidateBarcodeRequest
                        {
                            ValidateExistingInDatabase = true,
                            BssBNTypeCode = BssBNTypeCodeConstants.RegisterUnsortCC,
                            ValidateBarcodeType = BarcodeTypeConstants.BarcodeContainer,
                            DepartmentId = request.departmentId,
                            ValidateBarcodeItem = new List<ValidateBarcodeItem>()
                            {
                                new()
                                {
                                    BarcodeType = BarcodeTypeConstants.BarcodeContainer,
                                    BarcodeValue = request.container.Trim()
                                }
                            }
                        });

                ValidateBarcodeResponse? validateBarcodeResponse =
                    await validateBarcodeBuilder.Build().ValidateAsync();
                if (validateBarcodeResponse?.IsValid != true)
                    throw new BarcodeDuplicateException(string.Format(
                        ValidateBarcodeErrorMessage.BarcodeContainerDuplicate,
                        request.container.Trim()));

                #endregion ValidateDuplicateContainerCode

                var companyDepartment = await unitOfWork.CompanyDepartmentRepos.GetAsync(
                    w => w.DepartmentId == request.departmentId && w.CompanyId == request.companyId &&
                         w.IsActive == true, tracked: false);

                if (companyDepartment == null)
                {
                    throw new Exception("master company department not found.");
                }

                int statusId = BssStatusConstants.Received;
                if (companyDepartment.IsSendUnsortCC)
                {
                    statusId = BssStatusConstants.Registered;
                }

                // todo create new register unsort cc
                transactionRegisterUnsort = new TransactionRegisterUnsort
                {
                    ContainerCode = request.container,
                    DepartmentId = request.departmentId,
                    IsActive = true,
                    StatusId = statusId,
                    SupervisorReceived = null,
                    ReceivedDate = DateTime.Now,
                    Remark = string.Empty,
                    CreatedBy = request.createdBy,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = null,
                    UpdatedBy = null,
                    TransactionUnsortCCs = new List<TransactionUnsortCC>()
                };

                if (request.unsortCC is { Count: > 0 })
                {
                    foreach (var newUnsortCc in request.unsortCC)
                    {
                        transactionRegisterUnsort.TransactionUnsortCCs.Add(new TransactionUnsortCC
                        {
                            InstId = newUnsortCc.instId,
                            DenoId = newUnsortCc.denoId,
                            BanknoteQty = newUnsortCc.banknoteQty,
                            RemainingQty = newUnsortCc.banknoteQty,
                            AdjustQty = newUnsortCc.adjustQty,
                            IsActive = true,
                            CreatedBy = request.createdBy,
                            CreatedDate = DateTime.Now,
                            UpdatedDate = null,
                            UpdatedBy = null
                        });
                    }
                }

                await unitOfWork.TransactionRegisterUnsortRepos.AddAsync(transactionRegisterUnsort);
            }
            else
            {
                if (request.id is not null)
                {
                    transactionRegisterUnsort =
                        await unitOfWork.TransactionRegisterUnsortRepos
                            .GetRegisterUnsortByRegisterUnsortIdForConfirmAsync(
                                request.id.Value);

                    if (transactionRegisterUnsort == null)
                    {
                        throw new Exception("register unsort not found.");
                    }

                    if (request.isActive)
                    {
                        // todo update existing register unsort cc
                        transactionRegisterUnsort.ContainerCode = request.container;
                        transactionRegisterUnsort.UpdatedBy = request.updatedBy;
                        transactionRegisterUnsort.UpdatedDate = DateTime.Now;

                        unitOfWork.TransactionRegisterUnsortRepos.Update(transactionRegisterUnsort);

                        if (request.unsortCC is { Count: > 0 })
                        {
                            foreach (var requestUnsortCc in request.unsortCC)
                            {
                                if (requestUnsortCc.unsortCCId is null && requestUnsortCc.isActive)
                                {
                                    // todo create new unsort cc
                                    transactionRegisterUnsort.TransactionUnsortCCs.Add(new TransactionUnsortCC
                                        {
                                            InstId = requestUnsortCc.instId,
                                            DenoId = requestUnsortCc.denoId,
                                            BanknoteQty = requestUnsortCc.banknoteQty,
                                            RemainingQty = requestUnsortCc.banknoteQty,
                                            AdjustQty = requestUnsortCc.adjustQty,
                                            IsActive = true,
                                            CreatedBy = request.createdBy,
                                            CreatedDate = DateTime.Now
                                        }
                                    );
                                }
                                else if (requestUnsortCc.unsortCCId is not null)
                                {
                                    var existingUnsortCc =
                                        await unitOfWork.TransactionUnsortCCRepos.GetAsync(w =>
                                                w.UnsortCCId == requestUnsortCc.unsortCCId && w.IsActive == true,
                                            tracked: true);

                                    if (existingUnsortCc != null)
                                    {
                                        if (requestUnsortCc.isActive)
                                        {
                                            // todo update existing unsort cc
                                            if (transactionRegisterUnsort.StatusId == BssStatusConstants.Registered)
                                            {
                                                // Todo สถานะลงทะเบียยแก้ใข banknote qty จะแก้ใข remaining qty ด้วย
                                                existingUnsortCc.InstId = requestUnsortCc.instId;
                                                existingUnsortCc.DenoId = requestUnsortCc.denoId;
                                                existingUnsortCc.BanknoteQty = requestUnsortCc.banknoteQty;
                                                existingUnsortCc.RemainingQty = requestUnsortCc.banknoteQty;
                                                existingUnsortCc.AdjustQty = requestUnsortCc.adjustQty;
                                                existingUnsortCc.UpdatedBy = request.updatedBy;
                                                existingUnsortCc.UpdatedDate = DateTime.Now;
                                            }
                                            else
                                            {
                                                // Todo สถานะอื่นจะแก้ใขได้แต่จำนวน remaining qty
                                                existingUnsortCc.InstId = requestUnsortCc.instId;
                                                existingUnsortCc.DenoId = requestUnsortCc.denoId;
                                                existingUnsortCc.RemainingQty = requestUnsortCc.remainingQty;
                                                existingUnsortCc.AdjustQty = requestUnsortCc.adjustQty;
                                                existingUnsortCc.UpdatedBy = request.updatedBy;
                                                existingUnsortCc.UpdatedDate = DateTime.Now;
                                            }
                                        }
                                        else if (!requestUnsortCc.isActive)
                                        {
                                            // todo delete existing unsort cc
                                            existingUnsortCc.IsActive = false;
                                            existingUnsortCc.UpdatedDate = DateTime.Now;
                                            existingUnsortCc.UpdatedBy = request.updatedBy;
                                        }

                                        unitOfWork.TransactionUnsortCCRepos.Update(existingUnsortCc);
                                    }
                                }
                            }

                            await unitOfWork.SaveChangeAsync();
                            unitOfWork.ClearChangeTracker();

                            // todo delete register unsort if all unsort cc is delete
                            var allUnsortCc = await unitOfWork.TransactionUnsortCCRepos.GetAllAsync(
                                w => w.RegisterUnsortId == transactionRegisterUnsort.RegisterUnsortId &&
                                     w.IsActive == true, tracked: false);

                            if (allUnsortCc.All(w => w.RemainingQty == 0))
                            {
                                foreach (var unsortCc in allUnsortCc)
                                {
                                    unsortCc.IsActive = false;
                                    unsortCc.UpdatedBy = request.updatedBy;
                                    unsortCc.UpdatedDate = DateTime.Now;
                                    unitOfWork.TransactionUnsortCCRepos.Update(unsortCc);
                                }

                                transactionRegisterUnsort.IsActive = false;
                                transactionRegisterUnsort.UpdatedDate = DateTime.Now;
                                transactionRegisterUnsort.UpdatedBy = request.updatedBy;
                                transactionRegisterUnsort.StatusId = BssStatusConstants.DeletedPrePrepare;
                                transactionRegisterUnsort.TransactionUnsortCCs.Clear();
                                unitOfWork.TransactionRegisterUnsortRepos.Update(transactionRegisterUnsort);
                            }
                        }
                    }
                    else if (!request.isActive)
                    {
                        // todo delete existing register unsort cc
                        transactionRegisterUnsort.IsActive = false;
                        transactionRegisterUnsort.UpdatedDate = DateTime.Now;
                        transactionRegisterUnsort.UpdatedBy = request.updatedBy;
                        transactionRegisterUnsort.StatusId = BssStatusConstants.DeletedPrePrepare;

                        if (transactionRegisterUnsort.TransactionUnsortCCs is { Count: > 0 })
                        {
                            // todo delete all unsort cc
                            foreach (var unsortCc in transactionRegisterUnsort.TransactionUnsortCCs)
                            {
                                unsortCc.IsActive = false;
                                unsortCc.UpdatedBy = request.updatedBy;
                                unsortCc.UpdatedDate = DateTime.Now;
                            }
                        }

                        unitOfWork.TransactionRegisterUnsortRepos.Update(transactionRegisterUnsort);
                    }
                }
            }

            await unitOfWork.SaveChangeAsync();
            return transactionRegisterUnsort;
        }
    }
}