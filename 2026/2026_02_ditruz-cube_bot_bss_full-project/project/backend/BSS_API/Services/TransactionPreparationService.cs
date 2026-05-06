namespace BSS_API.Services
{
    using Helpers;
    using Interface;
    using System.Data;
    using Models.Common;
    using Core.Constants;
    using Models.Entities;
    using Models.ObjectModels;
    using Models.RequestModels;
    using Models.ResponseModels;
    using BSS_API.Repositories.Interface;
    using System.Linq;
    using BSS_API.Repositories;
    using Models.ModelHelper;

    public class TransactionPreparationService(IUnitOfWork unitOfWork) : ITransactionPreparationService
    {
        public async Task<IEnumerable<TransactionPreparation>> GetAllPreparation()
        {
            return await unitOfWork.TransactionPreparationRepos.GetAllAsync();
        }

        public async Task<IEnumerable<TransactionPreparationViewDisplay>> GetPreparationByDepartment(int departmentId)
        {
            var preparations = await unitOfWork.TransactionPreparationRepos.GetAllAsync();
            var containers = await unitOfWork.TransactionContainerPrepareRepos.GetAllAsync();
            var institutions = await unitOfWork.InstitutionRepos.GetAllAsync();
            var denominations = await unitOfWork.DenominationRepos.GetAllAsync();
            var cashcenters = await unitOfWork.CashCenterRepos.GetAllAsync();

            var result =
                from cp in containers
                join p in preparations on cp.ContainerPrepareId equals p.ContainerPrepareId
                join inst in institutions on p.InstId equals inst.InstitutionId into instJoin
                from inst in instJoin.DefaultIfEmpty()
                join d in denominations on p.DenoId equals d.DenominationId into denoJoin
                from deno in denoJoin.DefaultIfEmpty()
                join c in cashcenters on cp.DepartmentId equals c.DepartmentId into ccJoin
                from cc in ccJoin.DefaultIfEmpty()
                where cp.DepartmentId == departmentId
                select new TransactionPreparationViewDisplay
                {
                    PackageCode = p.PackageCode,
                    BundleCode = p.BundleCode,
                    HeaderCardCode = p.HeaderCardCode,
                    InstitutionShortName = inst?.InstitutionShortName,
                    CashCenterName = cc?.CashCenterName,
                    DenominationPrice = deno?.DenominationPrice,
                    PrepareDate = p.PrepareDate,
                    ContainerCode = cp.ContainerCode,
                };

            return result.ToList();
        }

        public async Task<DummyBarcodeResult> GenerateDummyBarcodeAsync(CreateDummyBarcode request)
        {
            DummyBarcodeResult dummyBarcodeResult = new();
            try
            {
                if (request.receiveId.HasValue)
                {
                    ReceiveCbmsDataTransaction? receiveCbmsDataTransaction =
                        await unitOfWork.CbmsTransactionRepos.GetAsync(item => item.ReceiveId == request.receiveId);

                    if (receiveCbmsDataTransaction != null)
                    {
                        int preparatedCount = (receiveCbmsDataTransaction.UnfitQty.Value -
                                               receiveCbmsDataTransaction.RemainingQty.Value);

                        BarcodeService.ValidateBarcodeServiceBuilder validateBarcodeBuilder =
                            new BarcodeService.ValidateBarcodeServiceBuilder()
                                .SetUnitOfWork(unitOfWork)
                                .SetReceiveCbmsDataTransaction(receiveCbmsDataTransaction);

                        BarcodeService barcodeService = validateBarcodeBuilder.Build();

                        dummyBarcodeResult.unfitQty = preparatedCount;
                        dummyBarcodeResult.dummyBarcode = await barcodeService.GenerateDummyBarcodeBundle();
                    }
                }
            }
            catch (Exception)
            {
                return dummyBarcodeResult;
            }

            return dummyBarcodeResult;
        }

        public async Task CreatePreparation(CreatePreparationRequest request)
        {
            var new_entity = new TransactionPreparation
            {
                ContainerPrepareId = request.ContainerPrepareId,
                HeaderCardCode = request.HeaderCardCode.Trim(),
                PackageCode = request.PackageCode.Trim(),
                BundleCode = request.BundleCode.Trim(),
                InstId = request.InstId,
                CashcenterId = request.CashcenterId,
                ZoneId = request.ZoneId,
                CashpointId = request.CashpointId,
                DenoId = request.DenoId,
                Qty = request.Qty,
                Remark = request.Remark.Trim(),
                StatusId = request.StatusId,
                PrepareDate = request.PrepareDate,
                IsReconcile = request.IsReconcile,
                IsActive = request.IsActive,
                CreatedBy = request.CreatedBy,
                CreatedDate = DateTime.Now
            };

            await unitOfWork.TransactionPreparationRepos.AddAsync(new_entity);
            await unitOfWork.SaveChangeAsync();
        }

        public async Task UpdatePreparation(UpdatePreparationRequest request)
        {
            var entity_row =
                await unitOfWork.TransactionPreparationRepos.GetAsync(item => item.PrepareId == request.PrepareId);
            entity_row.ContainerPrepareId = request.ContainerPrepareId;
            entity_row.HeaderCardCode = request.HeaderCardCode.Trim();
            entity_row.PackageCode = request.PackageCode.Trim();
            entity_row.BundleCode = request.BundleCode.Trim();
            entity_row.InstId = request.InstId;
            entity_row.CashcenterId = request.CashcenterId;
            entity_row.ZoneId = request.ZoneId;
            entity_row.CashpointId = request.CashpointId;
            entity_row.DenoId = request.DenoId;
            entity_row.Qty = request.Qty;
            entity_row.Remark = request.Remark.Trim();
            entity_row.StatusId = request.StatusId;
            entity_row.PrepareDate = request.PrepareDate;
            entity_row.IsReconcile = request.IsReconcile;
            entity_row.IsActive = request.IsActive;
            entity_row.UpdatedBy = request.UpdatedBy;
            entity_row.UpdatedDate = DateTime.Now;


            unitOfWork.TransactionPreparationRepos.Update(entity_row);
            await unitOfWork.SaveChangeAsync();
        }

        #region CreateContainerPrepare

        public async Task CreateContainerBarcode(CreateContainerBarcodeRequest request)
        {
            if (string.IsNullOrEmpty(request.PackageCode) || request.PackageCode.Length < 8)
            {
                throw new Exception("PackageCode is not valid.");
            }

            var instCode = request.PackageCode.Substring(0, 3);
            var cashCenterCode = request.PackageCode.Substring(3, 3);
            var denoCode = int.Parse(request.PackageCode.Substring(7, 1));

            var institution = await unitOfWork.InstitutionRepos.GetAsync(x => x.InstitutionCode == instCode);
            if (institution == null) throw new Exception("Institution not found.");

            var cashCenter = await unitOfWork.CashCenterRepos.GetAsync(x => x.CashCenterCode == cashCenterCode);
            if (cashCenter == null) throw new Exception("Cash center not found.");

            var denomination = await unitOfWork.DenominationRepos.GetAsync(x => x.DenominationCode == denoCode);
            if (denomination == null) throw new Exception("Denomination not found.");

            bool isNewContainerPrepare = true;
            var receiveCbmsData =
                await unitOfWork.CbmsTransactionRepos.GetAsync(w => w.ReceiveId == request.ReceiveId &&
                                                                    w.ContainerId == request.ContainerCode &&
                                                                    w.BarCode == request.PackageCode,
                    tracked: true);

            if (receiveCbmsData == null || receiveCbmsData.RemainingQty <= 0)
            {
                throw new Exception("cannot create container. receive cbms data remain_qty equal zero");
            }

            #region GetExistingTransactionContainerPrepare

            // Todo include all prepare
            var transactionContainerPrepare =
                await unitOfWork.TransactionContainerPrepareRepos
                    .GetTransactionContainerPrepareAndIncludePrepareWithReceiveIdAsync(
                        receiveCbmsData.ReceiveId, institution.InstitutionId,
                        denomination.DenominationId,
                        barcode: receiveCbmsData.BarCode);

            if (transactionContainerPrepare != null)
            {
                isNewContainerPrepare = false;

                transactionContainerPrepare.UpdatedBy = request.UpdatedBy;
                transactionContainerPrepare.UpdatedDate = DateTime.Now;
                transactionContainerPrepare.TransactionPreparation.Add(new TransactionPreparation
                {
                    PackageCode = request.PackageCode,
                    BundleCode = request.BundleCode,
                    HeaderCardCode = request.HeaderCardCode,
                    InstId = institution.InstitutionId,
                    CashcenterId = cashCenter.CashCenterId,
                    DenoId = receiveCbmsData.DenominationId,
                    Qty = 1000,
                    StatusId = BssStatusConstants.Prepared,
                    PrepareDate = DateTime.Today,
                    IsActive = true,
                    IsReconcile = false,
                    CreatedBy = request.CreatedBy,
                    CreatedDate = DateTime.Now
                });
            }
            else
            {
                // Todo create new container prepare
                transactionContainerPrepare = new TransactionContainerPrepare
                {
                    MachineId = request.MachineId,
                    DepartmentId = request.DepartmentId,
                    ReceiveId = request.ReceiveId,
                    ContainerCode = request.ContainerCode,
                    BntypeId = BNTypeConstants.Unfit,
                    IsActive = true,
                    CreatedBy = request.CreatedBy,
                    CreatedDate = DateTime.Now,
                    TransactionPreparation = new List<TransactionPreparation>
                    {
                        new()
                        {
                            PackageCode = request.PackageCode,
                            BundleCode = request.BundleCode,
                            HeaderCardCode = request.HeaderCardCode,
                            InstId = institution.InstitutionId,
                            CashcenterId = cashCenter.CashCenterId,
                            DenoId = receiveCbmsData.DenominationId,
                            Qty = 1000,
                            StatusId = BssStatusConstants.Prepared,
                            PrepareDate = DateTime.Today,
                            IsActive = true,
                            IsReconcile = false,
                            CreatedBy = request.CreatedBy,
                            CreatedDate = DateTime.Now
                        }
                    }
                };
            }

            #endregion GetExistingTransactionContainerPrepare

            if (isNewContainerPrepare)
            {
                await unitOfWork.TransactionContainerPrepareRepos.AddAsync(transactionContainerPrepare);
            }
            else
            {
                unitOfWork.TransactionContainerPrepareRepos.Update(transactionContainerPrepare);
            }

            receiveCbmsData.RemainingQty -= 1;
            receiveCbmsData.UpdatedBy = request.UpdatedBy;
            receiveCbmsData.UpdatedDate = DateTime.Now;

            unitOfWork.CbmsTransactionRepos.Update(receiveCbmsData);
            await unitOfWork.SaveChangeAsync();
        }

        public async Task<TransactionContainerPrepare> CreateCaMemberContainerAsync(
            CreateContainerBarcodeRequest request)
        {
            bool isNewContainerPrepare = true;
            const int QTY_REMAINING_QTY_NUMBER = 1000;

            TransactionPreparation? transactionPreparation;
            TransactionContainerPrepare? transactionContainerPrepare;

            return await unitOfWork.ExecuteWithTransactionAsync<TransactionContainerPrepare>(async () =>
            {
                await using var transaction = unitOfWork.ContextTransaction(IsolationLevel.ReadCommitted);

                try
                {
                    var receiveCbmsData =
                        await unitOfWork.CbmsTransactionRepos.GetAsync(w => w.ReceiveId == request.ReceiveId &&
                                                                            w.InstitutionId == request.InstitutionId &&
                                                                            w.DenominationId == request.DenominationId,
                            tracked: true);

                    if (receiveCbmsData == null || receiveCbmsData.RemainingQty <= 0)
                    {
                        throw new Exception("cannot create container. receive cbms data remain_qty equal zero");
                    }

                    // If caller provided a PackageCode, check existing preparations with same PackageCode.
                    // If all preparations with that PackageCode are inactive, force first-scan behaviour.
                    if (!string.IsNullOrWhiteSpace(request.PackageCode))
                    {
                        var packageCode = request.PackageCode.Trim();

                        // Find any active preparation with the same package code
                        var anyActivePreparation = await unitOfWork.TransactionPreparationRepos
                            .GetAsync(w => w.PackageCode == packageCode && w.IsActive == true, tracked: false);

                        if (anyActivePreparation == null)
                        {
                            // No active preparations found for this package -> treat as first scan
                            request.isFirstScan = true;
                        }
                    }

                    #region GetExistingTransactionContainerPrepare

                    // Todo include all prepare
                    transactionContainerPrepare =
                        await unitOfWork.TransactionContainerPrepareRepos
                            .GetTransactionContainerPrepareAndIncludePrepareWithReceiveIdAsync(
                                receiveCbmsData.ReceiveId, receiveCbmsData.InstitutionId,
                                receiveCbmsData.DenominationId);

                    if (transactionContainerPrepare is { TransactionPreparation.Count: > 0 })
                    {
                        // Todo add new preparation to existing container prepare
                        isNewContainerPrepare = false;
                        transactionContainerPrepare.UpdatedBy = request.UpdatedBy;
                        transactionContainerPrepare.UpdatedDate = DateTime.Now;

                        transactionPreparation = new TransactionPreparation
                        {
                            InstId = request.InstitutionId,
                            PackageCode = transactionContainerPrepare.TransactionPreparation.First().PackageCode,
                            HeaderCardCode = request.HeaderCardCode.Trim(),
                            ZoneId = request.ZoneId,
                            CashpointId = request.CashPointId,
                            DenoId = request.DenominationId,
                            Qty = QTY_REMAINING_QTY_NUMBER,
                            StatusId = BssStatusConstants.Prepared,
                            PrepareDate = DateTime.Today,
                            IsReconcile = false,
                            IsActive = true,
                            CreatedBy = request.CreatedBy,
                            CreatedDate = DateTime.Now
                        };

                        transactionContainerPrepare.TransactionPreparation.Add(transactionPreparation);
                    }
                    else
                    {
                        // Todo create new container prepare
                        transactionContainerPrepare = new TransactionContainerPrepare
                        {
                            ReceiveId = receiveCbmsData.ReceiveId,
                            DepartmentId = request.DepartmentId,
                            MachineId = request.MachineId,
                            ContainerCode = request.ContainerCode,
                            BntypeId = BNTypeConstants.UnsortCAMember,
                            CreatedBy = request.CreatedBy,
                            CreatedDate = DateTime.Now,
                            IsActive = true,
                            TransactionPreparation = new List<TransactionPreparation>()
                        };

                        transactionPreparation = new TransactionPreparation
                        {
                            InstId = request.InstitutionId,
                            HeaderCardCode = request.HeaderCardCode.Trim(),
                            ZoneId = request.ZoneId,
                            CashpointId = request.CashPointId,
                            DenoId = request.DenominationId,
                            Qty = QTY_REMAINING_QTY_NUMBER,
                            StatusId = BssStatusConstants.Prepared,
                            PrepareDate = DateTime.Today,
                            IsReconcile = false,
                            IsActive = true,
                            CreatedBy = request.CreatedBy,
                            CreatedDate = DateTime.Now
                        };

                        transactionContainerPrepare.TransactionPreparation.Add(transactionPreparation);
                    }

                    #endregion GetExistingTransactionContainerPrepare

                    BarcodeService.ValidateBarcodeServiceBuilder validateBarcodeBuilder =
                        new BarcodeService.ValidateBarcodeServiceBuilder()
                            .SetUnitOfWork(unitOfWork)
                            .SetTransactionContainerPrepare(transactionContainerPrepare,
                                request.CompanyId,
                                request.DepartmentId);

                    BarcodeService barcodeService = validateBarcodeBuilder.Build();

                    if (isNewContainerPrepare)
                    {
                        await barcodeService.GenerateBarcodeVersion2Async(BNType.UnsortCAMember, isFirstScan: request.isFirstScan, isValidateAfterGenerate: true);
                        await unitOfWork.TransactionContainerPrepareRepos.AddAsync(transactionContainerPrepare);
                    }
                    else
                    {
                        await barcodeService.GenerateBarcodeVersion2Async(BNType.UnsortCAMember, isFirstScan: request.isFirstScan, isValidateAfterGenerate: true);
                        unitOfWork.TransactionContainerPrepareRepos.Update(transactionContainerPrepare);
                    }

                    receiveCbmsData.RemainingQty -= QTY_REMAINING_QTY_NUMBER;
                    await unitOfWork.CommitAsync(transaction);
                }
                catch (Exception)
                {
                    await unitOfWork.RollbackAsync(transaction);
                    throw;
                }

                return transactionContainerPrepare;
            });
        }

        public async Task<BarcodePreviewResponse?> GetPreviewCaNonMemberGenerateBarcodeAsync(CreateContainerBarcodeRequest request)
        {
            const int QTY_REMAINING_QTY_NUMBER = 1000;

            TransactionPreparation? transactionPreparation;
            TransactionContainerPrepare? containerForPreview;

            try
            {
                if (request.CompanyId == null || request.DepartmentId == null || request.MachineId == null)
                    throw new Exception("CompanyId, DepartmentId, and MachineId must be provided.");

                // If caller provided a PackageCode, check existing preparations with same PackageCode.
                // If all preparations with that PackageCode are inactive, force first-scan behaviour.
                if (!string.IsNullOrWhiteSpace(request.PackageCode))
                {
                    var packageCode = request.PackageCode.Trim();

                    // Find any active preparation with the same package code
                    var anyActivePreparation = await unitOfWork.TransactionPreparationRepos
                        .GetAsync(w => w.PackageCode == packageCode && w.IsActive == true, tracked: false);

                    if (anyActivePreparation == null)
                    {
                        // No active preparations found for this package -> treat as first scan
                        request.isFirstScan = true;
                    }
                }

                var receiveCbmsData = await unitOfWork.CbmsTransactionRepos.GetAsync(
                    w => w.ReceiveId == request.ReceiveId &&
                         w.InstitutionId == request.InstitutionId &&
                         w.DenominationId == request.DenominationId,
                    tracked: false);

                if (receiveCbmsData == null || receiveCbmsData.RemainingQty <= 0)
                    throw new Exception("cannot create container. receive cbms data remain_qty equal zero");

                #region GetExistingTransactionContainerPrepare

                var existingContainer =
                    await unitOfWork.TransactionContainerPrepareRepos
                        .GetTransactionContainerPrepareAndIncludePrepareWithReceiveIdAsync(
                            receiveCbmsData.ReceiveId,
                            receiveCbmsData.InstitutionId,
                            receiveCbmsData.DenominationId,
                            cashCenterId: request.CashCenterId);

                if (existingContainer is { TransactionPreparation.Count: > 0 })
                {
                    containerForPreview = new TransactionContainerPrepare
                    {
                        ContainerPrepareId = existingContainer.ContainerPrepareId,
                        ReceiveId = existingContainer.ReceiveId,
                        DepartmentId = existingContainer.DepartmentId,
                        MachineId = existingContainer.MachineId,
                        ContainerCode = existingContainer.ContainerCode,
                        BntypeId = existingContainer.BntypeId,
                        CreatedBy = existingContainer.CreatedBy,
                        CreatedDate = existingContainer.CreatedDate,
                        UpdatedBy = existingContainer.UpdatedBy,
                        UpdatedDate = existingContainer.UpdatedDate,
                        IsActive = existingContainer.IsActive,

                        TransactionPreparation = existingContainer.TransactionPreparation
                            .Select(p => new TransactionPreparation
                            {
                                PrepareId = p.PrepareId,
                                InstId = p.InstId,
                                PackageCode = p.PackageCode,
                                BundleCode = p.BundleCode,
                                HeaderCardCode = p.HeaderCardCode,
                                CashcenterId = p.CashcenterId,
                                ZoneId = p.ZoneId,
                                CashpointId = p.CashpointId,
                                DenoId = p.DenoId,
                                Qty = p.Qty,
                                StatusId = p.StatusId,
                                PrepareDate = p.PrepareDate,
                                IsReconcile = p.IsReconcile,
                                IsActive = p.IsActive,
                                CreatedBy = p.CreatedBy,
                                CreatedDate = p.CreatedDate
                            })
                            .ToList()
                    };

                    transactionPreparation = new TransactionPreparation
                    {
                        InstId = request.InstitutionId,
                        PackageCode = existingContainer.TransactionPreparation.First().PackageCode,
                        HeaderCardCode = request.HeaderCardCode.Trim(),
                        CashcenterId = request.CashCenterId,
                        DenoId = request.DenominationId,
                        Qty = QTY_REMAINING_QTY_NUMBER,
                        StatusId = BssStatusConstants.Prepared,
                        PrepareDate = DateTime.Today,
                        IsReconcile = false,
                        IsActive = true,
                        CreatedBy = request.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    containerForPreview.TransactionPreparation.Add(transactionPreparation);
                }
                else
                {
                    containerForPreview = new TransactionContainerPrepare
                    {
                        ReceiveId = receiveCbmsData.ReceiveId,
                        DepartmentId = request.DepartmentId,
                        MachineId = request.MachineId,
                        ContainerCode = request.ContainerCode,
                        BntypeId = BNTypeConstants.UnsortCANonMember,
                        CreatedBy = request.CreatedBy,
                        CreatedDate = DateTime.Now,
                        IsActive = true,
                        TransactionPreparation = new List<TransactionPreparation>()
                    };

                    transactionPreparation = new TransactionPreparation
                    {
                        InstId = request.InstitutionId,
                        HeaderCardCode = request.HeaderCardCode.Trim(),
                        CashcenterId = request.CashCenterId,
                        DenoId = request.DenominationId,
                        Qty = QTY_REMAINING_QTY_NUMBER,
                        StatusId = BssStatusConstants.Prepared,
                        PrepareDate = DateTime.Today,
                        IsReconcile = false,
                        IsActive = true,
                        CreatedBy = request.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    containerForPreview.TransactionPreparation.Add(transactionPreparation);
                }

                #endregion

                var barcodeService = new BarcodeService.ValidateBarcodeServiceBuilder()
                    .SetUnitOfWork(unitOfWork)
                    .SetTransactionContainerPrepare(
                        containerForPreview,
                        request.CompanyId,
                        request.DepartmentId)
                    .Build();

                return await barcodeService.PreviewGenerateBarcodeAsync(BNType.UnsortCANonMember, isFirstScan: request.isFirstScan);
            }
            catch (Exception)
            {
                return null;
            }
        }
       
        public async Task<TransactionContainerPrepare> CreateCaNonMemberContainerAsync(
            CreateContainerBarcodeRequest request)
        {
            bool isNewContainerPrepare = true;
            const int QTY_REMAINING_QTY_NUMBER = 1000;

            TransactionPreparation? transactionPreparation;
            TransactionContainerPrepare? transactionContainerPrepare;

            return await unitOfWork.ExecuteWithTransactionAsync<TransactionContainerPrepare>(async () =>
            {
                await using var transaction = unitOfWork.ContextTransaction(IsolationLevel.ReadCommitted);

                try
                {
                    var receiveCbmsData =
                        await unitOfWork.CbmsTransactionRepos.GetAsync(w => w.ReceiveId == request.ReceiveId &&
                                                                            w.InstitutionId == request.InstitutionId &&
                                                                            w.DenominationId == request.DenominationId,
                            tracked: true);

                    if (receiveCbmsData == null || receiveCbmsData.RemainingQty <= 0)
                    {
                        throw new Exception("cannot create container. receive cbms data remain_qty equal zero");
                    }

                    // If caller provided a PackageCode, check existing preparations with same PackageCode.
                    // If all preparations with that PackageCode are inactive, force first-scan behaviour.
                    if (!string.IsNullOrWhiteSpace(request.PackageCode))
                    {
                        var packageCode = request.PackageCode.Trim();

                        // Find any active preparation with the same package code
                        var anyActivePreparation = await unitOfWork.TransactionPreparationRepos
                            .GetAsync(w => w.PackageCode == packageCode && w.IsActive == true, tracked: false);

                        if (anyActivePreparation == null)
                        {
                            // No active preparations found for this package -> treat as first scan
                            request.isFirstScan = true;
                        }
                    }

                    #region GetExistingTransactionContainerPrepare

                    // Todo include all prepare
                    transactionContainerPrepare =
                        await unitOfWork.TransactionContainerPrepareRepos
                            .GetTransactionContainerPrepareAndIncludePrepareWithReceiveIdAsync(
                                receiveCbmsData.ReceiveId, receiveCbmsData.InstitutionId,
                                receiveCbmsData.DenominationId,
                                cashCenterId: request.CashCenterId);

                    if (transactionContainerPrepare is { TransactionPreparation.Count: > 0 })
                    {
                        isNewContainerPrepare = false;
                        transactionContainerPrepare.UpdatedBy = request.CreatedBy;
                        transactionContainerPrepare.UpdatedDate = DateTime.Now;

                        transactionPreparation = new TransactionPreparation
                        {
                            InstId = request.InstitutionId,
                            PackageCode = transactionContainerPrepare.TransactionPreparation.First().PackageCode,
                            HeaderCardCode = request.HeaderCardCode.Trim(),
                            CashcenterId = request.CashCenterId,
                            DenoId = request.DenominationId,
                            Qty = QTY_REMAINING_QTY_NUMBER,
                            StatusId = BssStatusConstants.Prepared,
                            PrepareDate = DateTime.Today,
                            IsReconcile = false,
                            IsActive = true,
                            CreatedBy = request.CreatedBy,
                            CreatedDate = DateTime.Now,
                        };

                        transactionContainerPrepare.TransactionPreparation.Add(transactionPreparation);
                    }
                    else
                    {
                        transactionContainerPrepare = new TransactionContainerPrepare
                        {
                            ReceiveId = receiveCbmsData.ReceiveId,
                            DepartmentId = request.DepartmentId,
                            MachineId = request.MachineId,
                            ContainerCode = request.ContainerCode,
                            BntypeId = BNTypeConstants.UnsortCANonMember,
                            CreatedBy = request.CreatedBy,
                            CreatedDate = DateTime.Now,
                            IsActive = true,
                            TransactionPreparation = new List<TransactionPreparation>()
                        };

                        transactionPreparation = new TransactionPreparation
                        {
                            InstId = request.InstitutionId,
                            HeaderCardCode = request.HeaderCardCode.Trim(),
                            CashcenterId = request.CashCenterId,
                            DenoId = request.DenominationId,
                            Qty = QTY_REMAINING_QTY_NUMBER,
                            StatusId = BssStatusConstants.Prepared,
                            PrepareDate = DateTime.Today,
                            IsReconcile = false,
                            IsActive = true,
                            CreatedBy = request.CreatedBy,
                            CreatedDate = DateTime.Now,
                        };

                        transactionContainerPrepare.TransactionPreparation.Add(transactionPreparation);
                    }

                    #endregion GetExistingTransactionContainerPrepare

                    BarcodeService.ValidateBarcodeServiceBuilder validateBarcodeBuilder =
                     new BarcodeService.ValidateBarcodeServiceBuilder()
                         .SetUnitOfWork(unitOfWork)
                         .SetTransactionContainerPrepare(transactionContainerPrepare,
                             request.CompanyId,
                             request.DepartmentId);

                    BarcodeService barcodeService = validateBarcodeBuilder.Build();

                    if (isNewContainerPrepare)
                    {
                        await barcodeService.GenerateBarcodeVersion2Async(BNType.UnsortCANonMember, isFirstScan: request.isFirstScan,
                            isValidateAfterGenerate: true);
                        await unitOfWork.TransactionContainerPrepareRepos.AddAsync(transactionContainerPrepare);
                    }
                    else
                    {
                        await barcodeService.GenerateBarcodeVersion2Async(BNType.UnsortCANonMember, isFirstScan: request.isFirstScan,
                            isValidateAfterGenerate: true);
                        unitOfWork.TransactionContainerPrepareRepos.Update(transactionContainerPrepare);
                    }

                    receiveCbmsData.RemainingQty -= QTY_REMAINING_QTY_NUMBER;
                    await unitOfWork.CommitAsync(transaction);
                }
                catch (Exception)
                {
                    await unitOfWork.RollbackAsync(transaction);
                    throw;
                }

                return transactionContainerPrepare;
            });
        }

        public async Task<BarcodePreviewResponse?> GetPreviewUnsortCCGenerateBarcodeAsync(CreateContainerBarcodeRequest request)
        {
            const int QTY_REMAINING = 1;

            TransactionPreparation? newTransactionPreparation;
            TransactionContainerPrepare? transactionContainerPrepare;

            try
            {
                if (request.CompanyId == null || request.DepartmentId == null || request.MachineId == null)
                    throw new Exception("CompanyId, DepartmentId, and MachineId must be provided.");

                // If caller provided a PackageCode, check existing preparations with same PackageCode.
                // If all preparations with that PackageCode are inactive, force first-scan behaviour.
                if (!string.IsNullOrWhiteSpace(request.PackageCode))
                {
                    var packageCode = request.PackageCode.Trim();

                    // Find any active preparation with the same package code
                    var anyActivePreparation = await unitOfWork.TransactionPreparationRepos
                        .GetAsync(w => w.PackageCode == packageCode && w.IsActive == true, tracked: false);

                    if (anyActivePreparation == null)
                    {
                        // No active preparations found for this package -> treat as first scan
                        request.isFirstScan = true;
                    }
                }

                var unSortCcData =  await unitOfWork.TransactionUnsortCCRepos.GetAsync(
                            w => w.UnsortCCId == request.UnSortCcId &&
                            w.InstId == request.InstitutionId &&
                            w.DenoId == request.DenominationId &&
                            w.IsActive == true, tracked: false);

                if (unSortCcData == null || unSortCcData.RemainingQty <= 0)
                    throw new Exception("cannot create container. unsort cc not found or remain_qty equal zero");

                #region GetExistingTransactionContainerPrepare

                TransactionPreparation? existingTransactionPreparation =
                    await unitOfWork.TransactionPreparationRepos.GetAsync(
                        w => w.TransactionUnsortCCId == unSortCcData.UnsortCCId &&
                                w.InstId == unSortCcData.InstId &&
                                w.DenoId == unSortCcData.DenoId &&
                                w.IsActive == true, tracked: false);

                if (existingTransactionPreparation != null)
                {
                    transactionContainerPrepare = await unitOfWork.TransactionContainerPrepareRepos
                        .GetTransactionContainerPrepareAndIncludePrepareWithContainerIdAsync(
                            existingTransactionPreparation.ContainerPrepareId,
                            existingTransactionPreparation.InstId,
                            existingTransactionPreparation.DenoId);

                    if (transactionContainerPrepare != null)
                    {
                        transactionContainerPrepare.UpdatedBy = request.UpdatedBy;
                        transactionContainerPrepare.UpdatedDate = DateTime.Now;

                        newTransactionPreparation = new TransactionPreparation
                        {
                            PackageCode = existingTransactionPreparation.PackageCode,
                            TransactionUnsortCCId = unSortCcData.UnsortCCId,
                            InstId = request.InstitutionId,
                            HeaderCardCode = request.HeaderCardCode.Trim(),
                            ZoneId = request.ZoneId,
                            CashpointId = request.CashPointId,
                            DenoId = request.DenominationId,
                            Qty = QTY_REMAINING,
                            StatusId = BssStatusConstants.Prepared,
                            PrepareDate = DateTime.Today,
                            IsReconcile = false,
                            IsActive = true,
                            CreatedBy = request.CreatedBy,
                            CreatedDate = DateTime.Now,
                        };

                        transactionContainerPrepare.TransactionPreparation.Add(newTransactionPreparation);
                    }
                    else
                    {
                        throw new Exception("cannot create container. container prepare not found");
                    }
                }
                else
                {
                    transactionContainerPrepare = new TransactionContainerPrepare
                    {
                        DepartmentId = request.DepartmentId,
                        MachineId = request.MachineId,
                        ContainerCode = request.ContainerCode,
                        BntypeId = BNTypeConstants.UnsortCC,
                        CreatedBy = request.CreatedBy,
                        CreatedDate = DateTime.Now,
                        IsActive = true,
                        TransactionPreparation = new List<TransactionPreparation>()
                    };

                    newTransactionPreparation = new TransactionPreparation
                    {
                        TransactionUnsortCCId = unSortCcData.UnsortCCId,
                        InstId = request.InstitutionId,
                        HeaderCardCode = request.HeaderCardCode.Trim(),
                        ZoneId = request.ZoneId,
                        CashpointId = request.CashPointId,
                        DenoId = request.DenominationId,
                        Qty = QTY_REMAINING,
                        StatusId = BssStatusConstants.Prepared,
                        PrepareDate = DateTime.Today,
                        IsReconcile = false,
                        IsActive = true,
                        CreatedBy = request.CreatedBy,
                        CreatedDate = DateTime.Now,
                    };

                    transactionContainerPrepare.TransactionPreparation.Add(newTransactionPreparation);
                }

                #endregion

                var barcodeService = new BarcodeService.ValidateBarcodeServiceBuilder()
                    .SetUnitOfWork(unitOfWork)
                    .SetTransactionContainerPrepare(
                        transactionContainerPrepare,
                        request.CompanyId,
                        request.DepartmentId)
                    .Build();
                   
                return await barcodeService.PreviewGenerateBarcodeAsync(BNType.UnsortCC, isFirstScan: request.isFirstScan);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<BarcodePreviewResponse?> GetPreviewCaMemberGenerateBarcodeAsync(CreateContainerBarcodeRequest request)
        {
            const int QTY_REMAINING_QTY_NUMBER = 1000;

            TransactionPreparation? transactionPreparation;
            TransactionContainerPrepare? containerForPreview;

            try
            {
                if (request.CompanyId == null || request.DepartmentId == null || request.MachineId == null)
                    throw new Exception("CompanyId, DepartmentId, and MachineId must be provided.");

                // If caller provided a PackageCode, check existing preparations with same PackageCode.
                // If all preparations with that PackageCode are inactive, force first-scan behaviour.
                if (!string.IsNullOrWhiteSpace(request.PackageCode))
                {
                    var packageCode = request.PackageCode.Trim();

                    // Find any active preparation with the same package code
                    var anyActivePreparation = await unitOfWork.TransactionPreparationRepos
                        .GetAsync(w => w.PackageCode == packageCode && w.IsActive == true, tracked: false);

                    if (anyActivePreparation == null)
                    {
                        // No active preparations found for this package -> treat as first scan
                        request.isFirstScan = true;
                    }
                }

                var receiveCbmsData = await unitOfWork.CbmsTransactionRepos.GetAsync(
                    w => w.ReceiveId == request.ReceiveId &&
                         w.InstitutionId == request.InstitutionId &&
                         w.DenominationId == request.DenominationId,
                    tracked: false);

                if (receiveCbmsData == null || receiveCbmsData.RemainingQty <= 0)
                    throw new Exception("cannot create container. receive cbms data remain_qty equal zero");

                #region GetExistingTransactionContainerPrepare

                containerForPreview =
                     await unitOfWork.TransactionContainerPrepareRepos
                         .GetTransactionContainerPrepareAndIncludePrepareWithReceiveIdAsync(
                             receiveCbmsData.ReceiveId, receiveCbmsData.InstitutionId,
                             receiveCbmsData.DenominationId);

                if (containerForPreview is { TransactionPreparation.Count: > 0 })
                {
                    // Todo add new preparation to existing container prepare
                    containerForPreview.UpdatedBy = request.UpdatedBy;
                    containerForPreview.UpdatedDate = DateTime.Now;

                    transactionPreparation = new TransactionPreparation
                    {
                        InstId = request.InstitutionId,
                        PackageCode = containerForPreview.TransactionPreparation.First().PackageCode,
                        HeaderCardCode = request.HeaderCardCode.Trim(),
                        ZoneId = request.ZoneId,
                        CashpointId = request.CashPointId,
                        DenoId = request.DenominationId,
                        Qty = QTY_REMAINING_QTY_NUMBER,
                        StatusId = BssStatusConstants.Prepared,
                        PrepareDate = DateTime.Today,
                        IsReconcile = false,
                        IsActive = true,
                        CreatedBy = request.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    containerForPreview.TransactionPreparation.Add(transactionPreparation);
                }
                else
                {
                    // Todo create new container prepare
                    containerForPreview = new TransactionContainerPrepare
                    {
                        ReceiveId = receiveCbmsData.ReceiveId,
                        DepartmentId = request.DepartmentId,
                        MachineId = request.MachineId,
                        ContainerCode = request.ContainerCode,
                        BntypeId = BNTypeConstants.UnsortCAMember,
                        CreatedBy = request.CreatedBy,
                        CreatedDate = DateTime.Now,
                        IsActive = true,
                        TransactionPreparation = new List<TransactionPreparation>()
                    };

                    transactionPreparation = new TransactionPreparation
                    {
                        InstId = request.InstitutionId,
                        HeaderCardCode = request.HeaderCardCode.Trim(),
                        ZoneId = request.ZoneId,
                        CashpointId = request.CashPointId,
                        DenoId = request.DenominationId,
                        Qty = QTY_REMAINING_QTY_NUMBER,
                        StatusId = BssStatusConstants.Prepared,
                        PrepareDate = DateTime.Today,
                        IsReconcile = false,
                        IsActive = true,
                        CreatedBy = request.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    containerForPreview.TransactionPreparation.Add(transactionPreparation);
                }


                #endregion

                var barcodeService = new BarcodeService.ValidateBarcodeServiceBuilder()
                    .SetUnitOfWork(unitOfWork)
                    .SetTransactionContainerPrepare(
                        containerForPreview,
                        request.CompanyId,
                        request.DepartmentId)
                    .Build();

                return await barcodeService.PreviewGenerateBarcodeAsync(BNType.UnsortCAMember, request.isFirstScan);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<TransactionContainerPrepare> CreateUnSortCcContainerAsync(
            CreateContainerBarcodeRequest request)
        {
            bool isNewContainerPrepare = true;
            const int QTY_REMAINING = 1;

            TransactionPreparation? newTransactionPreparation;
            TransactionContainerPrepare? transactionContainerPrepare;

            return await unitOfWork.ExecuteWithTransactionAsync<TransactionContainerPrepare>(async () =>
            {
                await using var transaction = unitOfWork.ContextTransaction(IsolationLevel.ReadCommitted);

                try
                {
                    // Todo change to get unsort cc for update qty
                    var unSortCcData =
                        await unitOfWork.TransactionUnsortCCRepos.GetAsync(
                            w => w.UnsortCCId == request.UnSortCcId && w.InstId == request.InstitutionId &&
                                 w.DenoId == request.DenominationId && w.IsActive == true,
                            tracked: true);

                    if (unSortCcData is not { RemainingQty: > 0 })
                    {
                        throw new Exception("cannot create container. unsort cc not found or remain_qty equal zero");
                    }

                    // If caller provided a PackageCode, check existing preparations with same PackageCode.
                    // If all preparations with that PackageCode are inactive, force first-scan behaviour.
                    if (!string.IsNullOrWhiteSpace(request.PackageCode))
                    {
                        var packageCode = request.PackageCode.Trim();

                        // Find any active preparation with the same package code
                        var anyActivePreparation = await unitOfWork.TransactionPreparationRepos
                            .GetAsync(w => w.PackageCode == packageCode && w.IsActive == true, tracked: false);

                        if (anyActivePreparation == null)
                        {
                            // No active preparations found for this package -> treat as first scan
                            request.isFirstScan = true;
                        }
                    }

                    #region GetExistingTransactionContainerPrepare

                    TransactionPreparation? existingTransactionPreparation =
                        await unitOfWork.TransactionPreparationRepos.GetAsync(
                            w => w.TransactionUnsortCCId == unSortCcData.UnsortCCId &&
                                 w.InstId == unSortCcData.InstId && w.DenoId == unSortCcData.DenoId &&
                                 w.IsActive == true,
                            tracked: false);

                    // Todo found existing prepare
                    if (existingTransactionPreparation != null)
                    {
                        // Todo find container prepare and add new preparation
                        // Todo include all prepare
                        transactionContainerPrepare = await unitOfWork.TransactionContainerPrepareRepos
                            .GetTransactionContainerPrepareAndIncludePrepareWithContainerIdAsync(
                                existingTransactionPreparation.ContainerPrepareId,
                                existingTransactionPreparation.InstId,
                                existingTransactionPreparation.DenoId);

                        if (transactionContainerPrepare != null)
                        {
                            isNewContainerPrepare = false;
                            transactionContainerPrepare.UpdatedBy = request.UpdatedBy;
                            transactionContainerPrepare.UpdatedDate = DateTime.Now;

                            newTransactionPreparation = new TransactionPreparation
                            {
                                PackageCode = existingTransactionPreparation.PackageCode,
                                TransactionUnsortCCId = unSortCcData.UnsortCCId,
                                InstId = request.InstitutionId,
                                HeaderCardCode = request.HeaderCardCode.Trim(),
                                ZoneId = request.ZoneId,
                                CashpointId = request.CashPointId,
                                DenoId = request.DenominationId,
                                Qty = QTY_REMAINING,
                                StatusId = BssStatusConstants.Prepared,
                                PrepareDate = DateTime.Today,
                                IsReconcile = false,
                                IsActive = true,
                                CreatedBy = request.CreatedBy,
                                CreatedDate = DateTime.Now,
                            };

                            transactionContainerPrepare.TransactionPreparation.Add(newTransactionPreparation);
                        }
                        else
                        {
                            throw new Exception("cannot create container. container prepare not found");
                        }
                    }
                    else
                    {
                        transactionContainerPrepare = new TransactionContainerPrepare
                        {
                            DepartmentId = request.DepartmentId,
                            MachineId = request.MachineId,
                            ContainerCode = request.ContainerCode,
                            BntypeId = BNTypeConstants.UnsortCC,
                            CreatedBy = request.CreatedBy,
                            CreatedDate = DateTime.Now,
                            IsActive = true,
                            TransactionPreparation = new List<TransactionPreparation>()
                        };

                        newTransactionPreparation = new TransactionPreparation
                        {
                            TransactionUnsortCCId = unSortCcData.UnsortCCId,
                            InstId = request.InstitutionId,
                            HeaderCardCode = request.HeaderCardCode.Trim(),
                            ZoneId = request.ZoneId,
                            CashpointId = request.CashPointId,
                            DenoId = request.DenominationId,
                            Qty = QTY_REMAINING,
                            StatusId = BssStatusConstants.Prepared,
                            PrepareDate = DateTime.Today,
                            IsReconcile = false,
                            IsActive = true,
                            CreatedBy = request.CreatedBy,
                            CreatedDate = DateTime.Now,
                        };

                        transactionContainerPrepare.TransactionPreparation.Add(newTransactionPreparation);
                    }

                    #endregion GetExistingTransactionContainerPrepare

                    /*BarcodeService.ValidateBarcodeServiceBuilder validateBarcodeBuilder =
                        new BarcodeService.ValidateBarcodeServiceBuilder()
                            .SetUnitOfWork(unitOfWork)
                            .SetTransactionPreparation(newTransactionPreparation,
                                request.CompanyId,
                                request.DepartmentId);*/

                    BarcodeService.ValidateBarcodeServiceBuilder validateBarcodeBuilder =
                        new BarcodeService.ValidateBarcodeServiceBuilder()
                            .SetUnitOfWork(unitOfWork)
                            .SetTransactionContainerPrepare(transactionContainerPrepare,
                                request.CompanyId,
                                request.DepartmentId);

                    BarcodeService barcodeService = validateBarcodeBuilder.Build();

                    if (isNewContainerPrepare)
                    {
                        await barcodeService.GenerateBarcodeVersion2Async(BNType.UnsortCC, isFirstScan: request.isFirstScan, isValidateAfterGenerate: true);
                        await unitOfWork.TransactionContainerPrepareRepos.AddAsync(transactionContainerPrepare);
                    }
                    else
                    {
                        await barcodeService.GenerateBarcodeVersion2Async(BNType.UnsortCC, isFirstScan: request.isFirstScan, isValidateAfterGenerate: true);
                        unitOfWork.TransactionContainerPrepareRepos.Update(transactionContainerPrepare);
                    }

                    unSortCcData.RemainingQty -= QTY_REMAINING;
                    await unitOfWork.CommitAsync(transaction);
                }
                catch (Exception)
                {
                    await unitOfWork.RollbackAsync(transaction);
                    throw;
                }

                return transactionContainerPrepare;
            });
        }

        #endregion CreateContainerPrepare

        public async Task DeletePreparation(long Id)
        {
            var entity_row = await unitOfWork.TransactionPreparationRepos.GetAsync(item => item.PrepareId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                unitOfWork.TransactionPreparationRepos.Update(entity_row);
                await unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<IEnumerable<TransactionPreparationViewData>> GetAllPreparationAsync()
        {
            return await unitOfWork.TransactionPreparationRepos.GetAllPreparationAsync();
        }

        public async Task<TransactionPreparation> GetPreparationByIdAsync(long prepareId)
        {
            return await unitOfWork.TransactionPreparationRepos
                .GetPreparationByIdAsync(prepareId);
        }

        public async Task UpdatePreparationUnfit(UpdatePreparationUnfitRequest request)
        {
            var entity_row =
                await unitOfWork.TransactionPreparationRepos.GetAsync(item => item.PrepareId == request.PrepareId);

            entity_row.HeaderCardCode = request.HeaderCardCode?.Trim();
            entity_row.Remark = request.Remark.Trim();
            entity_row.UpdatedBy = request.UpdatedBy;
            entity_row.UpdatedDate = DateTime.Now;


            unitOfWork.TransactionPreparationRepos.Update(entity_row);
            await unitOfWork.SaveChangeAsync();
        }

        public Task<List<DeletePreparationUnfitResponse>> DeletePreparationUnfit(
            List<DeletePreparationUnfitRequest> requests)
        {
            var updatedBy = requests.FirstOrDefault(x => x.UpdatedBy > 0)?.UpdatedBy ?? 0;
            const int QTY_REMAINING_UNFIT = 1;
            return unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                if (requests == null || requests.Count == 0)
                    return new List<DeletePreparationUnfitResponse>();

                var ids = requests
                    .Select(x => x.PrepareId)
                    .Where(x => x > 0)
                    .Distinct()
                    .ToList();

                if (ids.Count == 0)
                    return new List<DeletePreparationUnfitResponse>();

                var rows = await unitOfWork.TransactionPreparationRepos
                    .GetPreparationByIdsAsync(ids);

                if (rows == null || !rows.Any())
                    return new List<DeletePreparationUnfitResponse>();

                var cancelStatusId = BssStatusConstants.CancelPrepared;
                var now = DateTime.Now;

                var containerIds = new HashSet<long>();

                var itemMap = requests
                    .Where(x => x.PrepareId > 0)
                    .GroupBy(x => x.PrepareId)
                    .ToDictionary(g => g.Key, g => g.First());

                var processedReceiveIds = new HashSet<long?>();
                var cbmsList = new List<ReceiveCbmsDataTransaction>();

                foreach (var row in rows)
                {
                    row.IsActive = false;

                    if (itemMap.TryGetValue(row.PrepareId, out var req))
                    {
                        row.Remark = req.Remark;
                        row.UpdatedBy = req.UpdatedBy;
                    }

                    row.StatusId = cancelStatusId;
                    row.UpdatedDate = now;

                    containerIds.Add(row.ContainerPrepareId);
                    unitOfWork.TransactionPreparationRepos.Update(row);

                    #region RestoreCbmsQty

                    var existingContainer = await unitOfWork.TransactionContainerPrepareRepos
                            .GetAsync(w => w.ContainerPrepareId == row.ContainerPrepareId && w.IsActive == true, tracked: false);

                    if (existingContainer == null)
                        throw new Exception("cannot restore existing ReceiveId. Container not found");

                    ReceiveCbmsDataTransaction existingCbms;

                    if (!processedReceiveIds.Contains(existingContainer.ReceiveId))
                    {
                        existingCbms = await unitOfWork.CbmsTransactionRepos.GetAsync(
                            w => w.ReceiveId == existingContainer.ReceiveId, tracked: false);

                        if (existingCbms == null)
                            throw new Exception("cannot restore cbms qty. cbms not found");

                        existingCbms.RemainingQty += QTY_REMAINING_UNFIT;
                        existingCbms.UpdatedBy = updatedBy;
                        existingCbms.UpdatedDate = now;

                        cbmsList.Add(existingCbms);
                        processedReceiveIds.Add(existingContainer.ReceiveId);
                    }
                    else
                    {
                        existingCbms = cbmsList.First(x => x.ReceiveId == existingContainer.ReceiveId);

                        existingCbms.RemainingQty += QTY_REMAINING_UNFIT;
                    }

                    foreach (var cbms in cbmsList)
                    {
                        unitOfWork.CbmsTransactionRepos.Update(cbms);
                    }

                    //existingCbms.RemainingQty += QTY_REMAINING_UNFIT;
                    //existingCbms.UpdatedBy = updatedBy;
                    //existingCbms.UpdatedDate = now;
                    //unitOfWork.CbmsTransactionRepos.Update(existingCbms);

                    #endregion RestoreCbmsQty
                }

                await unitOfWork.SaveChangeAsync();

                unitOfWork.ClearChangeTracker();
                // Todo delete container if all prepare is deleted
                foreach (var containerId in containerIds)
                {
                    var isAllDeleted = await unitOfWork.TransactionPreparationRepos
                        .IsAllPrepareDeletedInContainerAsync(containerId);

                    if (!isAllDeleted) continue;

                    var container = await unitOfWork.TransactionContainerPrepareRepos
                        .GetAsync(x => x.ContainerPrepareId == containerId);

                    if (container == null) continue;

                    container.IsActive = false;
                    container.UpdatedBy = updatedBy;
                    container.UpdatedDate = now;
                    unitOfWork.TransactionContainerPrepareRepos.Update(container);
                }

                await unitOfWork.SaveChangeAsync();

                return rows.Select(x => new DeletePreparationUnfitResponse
                {
                    PrepareId = x.PrepareId,
                    ContainerPrepareId = x.ContainerPrepareId,
                    IsActive = x.IsActive,
                    StatusId = x.StatusId,
                    Remark = x.Remark,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate
                }).ToList();
            });
        }

        public Task<List<EditPreparationUnfitResponse>> EditPreparationUnfit(List<EditPreparationUnfitRequest> requests)
        {
            return unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                if (requests == null || requests.Count == 0)
                    return new List<EditPreparationUnfitResponse>();

                var ids = requests
                    .Select(x => x.PrepareId)
                    .Where(x => x > 0)
                    .Distinct()
                    .ToList();

                if (ids.Count == 0)
                    return new List<EditPreparationUnfitResponse>();

                var rows = await unitOfWork.TransactionPreparationRepos
                    .GetPreparationByIdsAsync(ids);

                if (rows == null || !rows.Any())
                    return new List<EditPreparationUnfitResponse>();

                var isSingle = ids.Count == 1;
                var now = DateTime.Now;

                var reqMap = requests
                    .Where(x => x.PrepareId > 0)
                    .GroupBy(x => x.PrepareId)
                    .ToDictionary(g => g.Key, g => g.First());

                foreach (var row in rows)
                {
                    if (!reqMap.TryGetValue(row.PrepareId, out var req))
                        continue;

                    row.Remark = req.Remark;
                    row.CreatedBy = req.Createdby;
                    row.UpdatedBy = req.UpdatedBy;
                    row.UpdatedDate = now;

                    if (isSingle)
                    {
                        row.HeaderCardCode = req.HeaderCardCode;
                    }

                    unitOfWork.TransactionPreparationRepos.Update(row);
                }

                await unitOfWork.SaveChangeAsync();

                return rows.Select(x => new EditPreparationUnfitResponse
                {
                    PrepareId = x.PrepareId,
                    HeaderCardCode = x.HeaderCardCode,
                    Remark = x.Remark,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate,
                    CreatedBy = x.CreatedBy
                }).ToList();
            });
        }

        public async Task<PagedData<PreparationUnfitResponse>> GetPreparationUnfitAsync(
            PagedRequest<PreparationUnfitRequest> request,
            CancellationToken ct = default)
        {
            return await unitOfWork.TransactionPreparationRepos.GetPreparationUnfitAsync(request, ct);
        }

        public async Task<PagedData<PreparationUnsortCaNonMemberResponse>> GetPreparationUnsortCaNonMemberAsync(
            PagedRequest<PreparationUnsortCaNonMemberRequest> request,
            CancellationToken ct = default)
        {
            return await unitOfWork.TransactionPreparationRepos.GetPreparationUnsortCaNonMemberAsync(request, ct);
        }

        public async Task<CountPrepareResponseModel> GetCountPrepareByContainerAsync(
            CountPrepareByContainerRequest request)
        {

            ICollection<MasterConfig> masterConfigList =
                        await unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync(ConfigConstants.BSS_WORK_DAY);


            DateTime startDate = masterConfigList.ToScanPrepareBssWorkDayStartDateTime();
            DateTime endDate = masterConfigList.ToScanPrepareBssWorkDayEndDateTime();

            return await unitOfWork.TransactionPreparationRepos.GetCountPrepareByContainerAsync(request, startDate, endDate);
        }

        public async Task<CountReconcileResponseModel> GetCountReconcileAsync(GetCountReconcileRequest request)
        {
            return await unitOfWork.TransactionPreparationRepos.GetCountReconcileAsync(request);
        }

        public async Task<TransactionContainerPrepare?> TestTransactionAsync()
        {
            return await unitOfWork.ExecuteWithTransactionAsync(async () =>
            {
                await using var transaction = unitOfWork.ContextTransaction(IsolationLevel.ReadCommitted);
                var txnContainer =
                    await unitOfWork.TransactionContainerPrepareRepos.GetAsync(w => w.ContainerPrepareId == 51,
                        tracked: true);
                if (txnContainer != null)
                {
                    txnContainer.IsActive = false;
                }

                await unitOfWork.RollbackAsync(transaction);
                return txnContainer;
            });
        }

        public Task<List<DeletePreparationUnsortCaNonMemberResponse>> DeletePreparationUnsortCaNonMember(
      List<DeletePreparationUnsortCaNonMemberRequest> requests)
        {
            var updatedBy = requests.FirstOrDefault(x => x.UpdatedBy > 0)?.UpdatedBy ?? 0;
            const int QTY_REMAINING_CA_NON_MEMBER = 1000;
            return unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                if (requests == null || requests.Count == 0)
                    return new List<DeletePreparationUnsortCaNonMemberResponse>();

                var ids = requests
                    .Select(x => x.PrepareId)
                    .Where(x => x > 0)
                    .Distinct()
                    .ToList();

                if (ids.Count == 0)
                    return new List<DeletePreparationUnsortCaNonMemberResponse>();

                var rows = await unitOfWork.TransactionPreparationRepos
                    .GetPreparationByIdsAsync(ids);

                if (rows == null || !rows.Any())
                    return new List<DeletePreparationUnsortCaNonMemberResponse>();

                var cancelStatusId = BssStatusConstants.CancelPrepared;
                var now = DateTime.Now;

                var containerIds = new HashSet<long>();

                var itemMap = requests
                    .Where(x => x.PrepareId > 0)
                    .GroupBy(x => x.PrepareId)
                    .ToDictionary(g => g.Key, g => g.First());

                var processedReceiveIds = new HashSet<long?>();
                var cbmsList = new List<ReceiveCbmsDataTransaction>();

                foreach (var row in rows)
                {
                    row.IsActive = false;

                    if (itemMap.TryGetValue(row.PrepareId, out var req))
                    {
                        row.Remark = req.Remark;
                        row.UpdatedBy = req.UpdatedBy;
                    }

                    row.StatusId = cancelStatusId;
                    row.UpdatedDate = now;

                    containerIds.Add(row.ContainerPrepareId);
                    unitOfWork.TransactionPreparationRepos.Update(row);

                    #region RestoreCbmsQty

                    // ── เปลี่ยนจาก navigation property มาเป็น query ตรงๆ เหมือน Unfit ──
                    var existingContainer = await unitOfWork.TransactionContainerPrepareRepos
                            .GetAsync(w => w.ContainerPrepareId == row.ContainerPrepareId && w.IsActive == true, tracked: false);

                    if (existingContainer == null)
                        throw new Exception("cannot restore existing ReceiveId. Container not found");

                    ReceiveCbmsDataTransaction existingCbms;

                    if (!processedReceiveIds.Contains(existingContainer.ReceiveId))
                    {
                        existingCbms = await unitOfWork.CbmsTransactionRepos.GetAsync(
                            w => w.ReceiveId == existingContainer.ReceiveId, tracked: false);

                        if (existingCbms == null)
                            throw new Exception("cannot restore cbms qty. cbms not found");

                        existingCbms.RemainingQty += QTY_REMAINING_CA_NON_MEMBER;
                        existingCbms.UpdatedBy = updatedBy;
                        existingCbms.UpdatedDate = now;

                        cbmsList.Add(existingCbms);
                        processedReceiveIds.Add(existingContainer.ReceiveId);
                    }
                    else
                    {
                        existingCbms = cbmsList.First(x => x.ReceiveId == existingContainer.ReceiveId);

                        existingCbms.RemainingQty += QTY_REMAINING_CA_NON_MEMBER;
                    }

                    foreach (var cbms in cbmsList)
                    {
                        unitOfWork.CbmsTransactionRepos.Update(cbms);
                    }

                    #endregion RestoreCbmsQty
                }

                await unitOfWork.SaveChangeAsync();

                unitOfWork.ClearChangeTracker();
                // Todo delete container if all prepare is deleted
                foreach (var containerId in containerIds)
                {
                    var isAllDeleted = await unitOfWork.TransactionPreparationRepos
                        .IsAllPrepareDeletedInContainerAsync(containerId);

                    if (!isAllDeleted) continue;

                    var container = await unitOfWork.TransactionContainerPrepareRepos
                        .GetAsync(x => x.ContainerPrepareId == containerId);

                    if (container == null) continue;

                    container.IsActive = false;
                    container.UpdatedBy = updatedBy;
                    container.UpdatedDate = now;
                    unitOfWork.TransactionContainerPrepareRepos.Update(container);
                }

                await unitOfWork.SaveChangeAsync();

                return rows.Select(x => new DeletePreparationUnsortCaNonMemberResponse
                {
                    PrepareId = x.PrepareId,
                    ContainerPrepareId = x.ContainerPrepareId,
                    PackageCode = x.PackageCode,
                    IsActive = x.IsActive,
                    StatusId = x.StatusId,
                    Remark = x.Remark,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate
                }).ToList();
            });
        }

        public Task<List<EditPreparationUnsortCaNonMemberResponse>> EditPreparationUnsortCaNonMember(
            List<EditPreparationUnsortCaNonMemberRequest> requests)
        {
            return unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                if (requests == null || requests.Count == 0)
                    return new List<EditPreparationUnsortCaNonMemberResponse>();

                var ids = requests
                    .Select(x => x.PrepareId)
                    .Where(x => x > 0)
                    .Distinct()
                    .ToList();

                if (ids.Count == 0)
                    return new List<EditPreparationUnsortCaNonMemberResponse>();

                var rows = await unitOfWork.TransactionPreparationRepos
                    .GetPreparationByIdsAsync(ids);

                if (rows == null || !rows.Any())
                    return new List<EditPreparationUnsortCaNonMemberResponse>();

                var isSingle = ids.Count == 1;
                var now = DateTime.Now;

                var reqMap = requests
                    .Where(x => x.PrepareId > 0)
                    .GroupBy(x => x.PrepareId)
                    .ToDictionary(g => g.Key, g => g.First());

                foreach (var row in rows)
                {
                    if (!reqMap.TryGetValue(row.PrepareId, out var req))
                        continue;

                    row.Remark = req.Remark;
                    row.CreatedBy = req.Createdby;
                    row.UpdatedBy = req.UpdatedBy;
                    row.UpdatedDate = now;

                    if (isSingle)
                    {
                        row.HeaderCardCode = req.HeaderCardCode;
                    }

                    unitOfWork.TransactionPreparationRepos.Update(row);
                }

                await unitOfWork.SaveChangeAsync();

                return rows.Select(x => new EditPreparationUnsortCaNonMemberResponse
                {
                    PrepareId = x.PrepareId,
                    HeaderCardCode = x.HeaderCardCode,
                    Remark = x.Remark,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate,
                    CreatedBy = x.CreatedBy
                }).ToList();
            });
        }

        public async Task<PagedData<PreparationUnsortCaMemberResponse>> GetPreparationUnsortCaMemberAsync(
            PagedRequest<PreparationUnsortCaMemberRequest> request,
            CancellationToken ct = default)
        {
            return await unitOfWork.TransactionPreparationRepos.GetPreparationUnsortCaMemberAsync(request, ct);
        }

        public async Task<PagedData<PreparationUnsortCCResponse>?> GetPreparationUnsortCCAsync(
            PagedRequest<PreparationUnsortCCRequest> request,
            CancellationToken ct = default)
        {
            return await unitOfWork.TransactionPreparationRepos.GetPreparationUnsortCCAsync(request, ct);
        }

        public Task<List<DeletePreparationUnsortCaMemberResponse>> DeletePreparationUnsortCaMember(
        List<DeletePreparationUnsortCaMemberRequest> requests)
        {
            var updatedBy = requests.FirstOrDefault(x => x.UpdatedBy > 0)?.UpdatedBy ?? 0;
            const int QTY_REMAINING_CA_MEMBER = 1000;
            return unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                if (requests == null || requests.Count == 0)
                    return new List<DeletePreparationUnsortCaMemberResponse>();

                var ids = requests
                    .Select(x => x.PrepareId)
                    .Where(x => x > 0)
                    .Distinct()
                    .ToList();

                if (ids.Count == 0)
                    return new List<DeletePreparationUnsortCaMemberResponse>();

                var rows = await unitOfWork.TransactionPreparationRepos
                    .GetPreparationByIdsAsync(ids);

                if (rows == null || !rows.Any())
                    return new List<DeletePreparationUnsortCaMemberResponse>();

                var cancelStatusId = BssStatusConstants.CancelPrepared;
                var now = DateTime.Now;

                var containerIds = new HashSet<long>();

                var itemMap = requests
                    .Where(x => x.PrepareId > 0)
                    .GroupBy(x => x.PrepareId)
                    .ToDictionary(g => g.Key, g => g.First());

                var processedReceiveIds = new HashSet<long?>();
                var cbmsList = new List<ReceiveCbmsDataTransaction>();

                foreach (var row in rows)
                {
                    row.IsActive = false;

                    if (itemMap.TryGetValue(row.PrepareId, out var req))
                    {
                        row.Remark = req.Remark;
                        row.UpdatedBy = req.UpdatedBy;
                    }

                    row.StatusId = cancelStatusId;
                    row.UpdatedDate = now;

                    containerIds.Add(row.ContainerPrepareId);
                    unitOfWork.TransactionPreparationRepos.Update(row);

                    #region RestoreCbmsQty

                    var existingContainer = await unitOfWork.TransactionContainerPrepareRepos
                            .GetAsync(w => w.ContainerPrepareId == row.ContainerPrepareId && w.IsActive == true, tracked: false);

                    if (existingContainer == null)
                        throw new Exception("cannot restore existing ReceiveId. Container not found");

                    ReceiveCbmsDataTransaction existingCbms;

                    if (!processedReceiveIds.Contains(existingContainer.ReceiveId))
                    {
                        existingCbms = await unitOfWork.CbmsTransactionRepos.GetAsync(
                            w => w.ReceiveId == existingContainer.ReceiveId, tracked: false);

                        if (existingCbms == null)
                            throw new Exception("cannot restore cbms qty. cbms not found");

                        existingCbms.RemainingQty += QTY_REMAINING_CA_MEMBER;
                        existingCbms.UpdatedBy = updatedBy;
                        existingCbms.UpdatedDate = now;

                        cbmsList.Add(existingCbms);
                        processedReceiveIds.Add(existingContainer.ReceiveId);
                    }
                    else
                    {
                        existingCbms = cbmsList.First(x => x.ReceiveId == existingContainer.ReceiveId);

                        existingCbms.RemainingQty += QTY_REMAINING_CA_MEMBER;
                    }

                    foreach (var cbms in cbmsList)
                    {
                        unitOfWork.CbmsTransactionRepos.Update(cbms);
                    }

                    #endregion RestoreCbmsQty
                }

                await unitOfWork.SaveChangeAsync();

                unitOfWork.ClearChangeTracker(); // ── เพิ่ม เหมือน Unfit ──
                                                 // Todo delete container if all prepare is deleted
                foreach (var containerId in containerIds)
                {
                    var isAllDeleted = await unitOfWork.TransactionPreparationRepos
                        .IsAllPrepareDeletedInContainerAsync(containerId);

                    if (!isAllDeleted) continue;

                    var container = await unitOfWork.TransactionContainerPrepareRepos
                        .GetAsync(x => x.ContainerPrepareId == containerId);

                    if (container == null) continue;

                    container.IsActive = false;
                    container.UpdatedBy = updatedBy;
                    container.UpdatedDate = now;
                    unitOfWork.TransactionContainerPrepareRepos.Update(container);
                }

                await unitOfWork.SaveChangeAsync();

                return rows.Select(x => new DeletePreparationUnsortCaMemberResponse
                {
                    PrepareId = x.PrepareId,
                    ContainerPrepareId = x.ContainerPrepareId,
                    IsActive = x.IsActive,
                    StatusId = x.StatusId,
                    Remark = x.Remark,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate
                }).ToList();
            });
        }

        public Task<List<EditPreparationUnsortCaMemberResponse>> EditPreparationUnsortCaMember(
            List<EditPreparationUnsortCaMemberRequest> requests)
        {
            return unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                if (requests == null || requests.Count == 0)
                    return new List<EditPreparationUnsortCaMemberResponse>();

                var ids = requests
                    .Select(x => x.PrepareId)
                    .Where(x => x > 0)
                    .Distinct()
                    .ToList();

                if (ids.Count == 0)
                    return new List<EditPreparationUnsortCaMemberResponse>();

                var rows = await unitOfWork.TransactionPreparationRepos
                    .GetPreparationByIdsAsync(ids);

                if (rows == null || !rows.Any())
                    return new List<EditPreparationUnsortCaMemberResponse>();

                var isSingle = ids.Count == 1;
                var now = DateTime.Now;

                var reqMap = requests
                    .Where(x => x.PrepareId > 0)
                    .GroupBy(x => x.PrepareId)
                    .ToDictionary(g => g.Key, g => g.First());

                foreach (var row in rows)
                {
                    if (!reqMap.TryGetValue(row.PrepareId, out var req))
                        continue;

                    row.Remark = req.Remark;
                    row.CreatedBy = req.Createdby;
                    row.UpdatedBy = req.UpdatedBy;
                    row.UpdatedDate = now;

                    if (isSingle)
                    {
                        row.HeaderCardCode = req.HeaderCardCode;
                    }

                    unitOfWork.TransactionPreparationRepos.Update(row);
                }

                await unitOfWork.SaveChangeAsync();

                return rows.Select(x => new EditPreparationUnsortCaMemberResponse
                {
                    PrepareId = x.PrepareId,
                    HeaderCardCode = x.HeaderCardCode,
                    Remark = x.Remark,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate,
                    CreatedBy = x.CreatedBy
                }).ToList();
            });
        }

        #region PrepapationUnsortCC

        public Task<List<EditPreparationUnsortCCResponse>> EditPreparationUnsortCC(
            List<EditPreparationUnsortCCRequest> requests)
        {
            return unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                if (requests == null || requests.Count == 0)
                    return new List<EditPreparationUnsortCCResponse>();

                var ids = requests
                    .Select(x => x.PrepareId)
                    .Where(x => x > 0)
                    .Distinct()
                    .ToList();

                if (ids.Count == 0)
                    return new List<EditPreparationUnsortCCResponse>();

                var rows = await unitOfWork.TransactionPreparationRepos
                    .GetPreparationByIdsAsync(ids);

                if (rows == null || !rows.Any())
                    return new List<EditPreparationUnsortCCResponse>();

                var isSingle = ids.Count == 1;
                var now = DateTime.Now;

                var reqMap = requests
                    .Where(x => x.PrepareId > 0)
                    .GroupBy(x => x.PrepareId)
                    .ToDictionary(g => g.Key, g => g.First());

                foreach (var row in rows)
                {
                    if (!reqMap.TryGetValue(row.PrepareId, out var req))
                        continue;

                    row.Remark = req.Remark;
                    row.CreatedBy = req.Createdby;
                    row.UpdatedBy = req.UpdatedBy;
                    row.UpdatedDate = now;

                    if (isSingle)
                    {
                        row.HeaderCardCode = req.HeaderCardCode;
                    }

                    unitOfWork.TransactionPreparationRepos.Update(row);
                }

                await unitOfWork.SaveChangeAsync();

                return rows.Select(x => new EditPreparationUnsortCCResponse
                {
                    PrepareId = x.PrepareId,
                    HeaderCardCode = x.HeaderCardCode,
                    Remark = x.Remark,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate,
                    CreatedBy = x.CreatedBy
                }).ToList();
            });
        }

        public Task<List<DeletePreparationUnsortCCResponse>> DeletePreparationUnsortCC(
     List<DeletePreparationUnsortCCRequest> requests)
        {
            var updatedBy = requests.FirstOrDefault(x => x.UpdatedBy > 0)?.UpdatedBy ?? 0;
            const int QTY_REMAINING = 1;
            return unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                if (requests == null || requests.Count == 0)
                    return new List<DeletePreparationUnsortCCResponse>();

                var ids = requests
                    .Select(x => x.PrepareId)
                    .Where(x => x > 0)
                    .Distinct()
                    .ToList();

                if (ids.Count == 0)
                    return new List<DeletePreparationUnsortCCResponse>();

                var rows = await unitOfWork.TransactionPreparationRepos
                    .GetPreparationByIdsAsync(ids);

                if (rows == null || !rows.Any())
                    return new List<DeletePreparationUnsortCCResponse>();

                var cancelStatusId = BssStatusConstants.CancelPrepared;
                var now = DateTime.Now;

                var containerIds = new HashSet<long>();

                var itemMap = requests
                    .Where(x => x.PrepareId > 0)
                    .GroupBy(x => x.PrepareId)
                    .ToDictionary(g => g.Key, g => g.First());

                var processedUnsortCCIds = new HashSet<long?>();
                var unsortCCList = new List<TransactionUnsortCC>(); // ── เปลี่ยน type ตาม entity ──

                foreach (var row in rows)
                {
                    row.IsActive = false;

                    if (itemMap.TryGetValue(row.PrepareId, out var req))
                    {
                        row.Remark = req.Remark;
                        row.UpdatedBy = req.UpdatedBy;
                    }

                    row.StatusId = cancelStatusId;
                    row.UpdatedDate = now;

                    containerIds.Add(row.ContainerPrepareId);
                    unitOfWork.TransactionPreparationRepos.Update(row);

                    #region UpdateUnsortCC

                    TransactionUnsortCC unsortCc;

                    if (!processedUnsortCCIds.Contains(row.TransactionUnsortCCId))
                    {
                        unsortCc = await unitOfWork.TransactionUnsortCCRepos.GetAsync(
                            w => w.UnsortCCId == row.TransactionUnsortCCId, tracked: false);

                        if (unsortCc == null)
                            throw new Exception("update remain qty error. unsort cc not found");

                        unsortCc.RemainingQty += QTY_REMAINING;

                        unsortCCList.Add(unsortCc);
                        processedUnsortCCIds.Add(row.TransactionUnsortCCId);
                    }
                    else
                    {
                        unsortCc = unsortCCList.First(x => x.UnsortCCId == row.TransactionUnsortCCId);

                        unsortCc.RemainingQty += QTY_REMAINING;
                    }

                    foreach (var item in unsortCCList)
                    {
                        unitOfWork.TransactionUnsortCCRepos.Update(item);
                    }

                    #endregion UpdateUnsortCC
                }

                await unitOfWork.SaveChangeAsync();

                unitOfWork.ClearChangeTracker();
                // Todo delete container if all prepare is deleted
                foreach (var containerId in containerIds)
                {
                    var isAllDeleted = await unitOfWork.TransactionPreparationRepos
                        .IsAllPrepareDeletedInContainerAsync(containerId);
                    
                    if (!isAllDeleted) continue;

                    var container = await unitOfWork.TransactionContainerPrepareRepos
                        .GetAsync(x => x.ContainerPrepareId == containerId);

                    if (container == null) continue;

                    container.IsActive = false;
                    container.UpdatedBy = updatedBy;
                    container.UpdatedDate = now;
                    unitOfWork.TransactionContainerPrepareRepos.Update(container);
                }

                await unitOfWork.SaveChangeAsync();

                return rows.Select(x => new DeletePreparationUnsortCCResponse
                {
                    PrepareId = x.PrepareId,
                    ContainerPrepareId = x.ContainerPrepareId,
                    IsActive = x.IsActive,
                    StatusId = x.StatusId,
                    Remark = x.Remark,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate
                }).ToList();
            });
        }
        #endregion PrepapationUnsortCC

        public async Task<TransactionContainerPrepare> GetExistingTransactionContainerPrepare(
            ExistingTransactionContainerPrepareRequest request)
        {
            TransactionContainerPrepare? transactionContainerPrepare;

            try
            {
                var receiveCbmsData = await unitOfWork.CbmsTransactionRepos.GetAsync(w =>
                        w.ReceiveId == request.ReceiveId &&
                        w.InstitutionId == request.InstitutionId &&
                        w.DenominationId == request.DenominationId,
                    tracked: true);

                if (receiveCbmsData == null)
                {
                    throw new Exception("receive cbms data is null or empty.");
                }

                transactionContainerPrepare =
                    await unitOfWork.TransactionContainerPrepareRepos
                        .GetTransactionContainerPrepareAndIncludePrepareWithReceiveIdAsync(
                            receiveCbmsData.ReceiveId, receiveCbmsData.InstitutionId,
                            receiveCbmsData.DenominationId,
                            cashCenterId: request.CashCenterId);
            }
            catch (Exception)
            {
                throw;
            }

            return transactionContainerPrepare;
        }
    }
}