namespace BSS_API.Services
{
    using Interface;
    using BSS_API.Repositories.Interface;
    using BSS_API.Models.Common;
    using BSS_API.Models.Entities;
    using BSS_API.Models.RequestModels;
    using BSS_API.Models.ResponseModels;
    using BSS_API.Core.Constants;

    public class TransactionReconciliationTranService(IUnitOfWork unitOfWork) : ITransactionReconciliationTranService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;

        public async Task<PagedData<ReconciliationTransactionResponse>> GetReconciliationTransactionsAsync(
            PagedRequest<ReconciliationFilterRequest> request, CancellationToken ct = default)
        {
            return await _unitOfWork.TransactionReconciliationTranRepos.GetReconciliationTransactionsAsync(request, ct);
        }

        public async Task<ReconciliationScanResponse> ScanHeaderCardAsync(ReconciliationScanRequest request)
        {
            // 1. Find preparation by HeaderCardCode
            var preparation = await _unitOfWork.TransactionPreparationRepos
                .GetFirstOrDefaultAsync(p => p.HeaderCardCode == request.HeaderCardCode && p.IsActive == true);

            if (preparation == null)
            {
                return new ReconciliationScanResponse
                {
                    IsSuccess = false,
                    Message = "ไม่พบ Header Card นี้ในระบบ"
                };
            }

            // 2. Check if already scanned — return existing pending or cancelled record
            if (preparation.IsReconcile == true)
            {
                var existing = await _unitOfWork.TransactionReconciliationTranRepos
                    .GetFirstOrDefaultAsync(rt =>
                        rt.HeaderCardCode == request.HeaderCardCode
                        && rt.IsActive == true
                        && (rt.StatusId == BssStatusConstants.Reconciliation || rt.StatusId == BssStatusConstants.CancelReconciliation));

                if (existing != null)
                {
                    // Locked (cancel >= 3) — block even if status is still 11
                    if (existing.IsNotReconcile == true)
                    {
                        return new ReconciliationScanResponse
                        {
                            HeaderCardCode = request.HeaderCardCode,
                            IsSuccess = false,
                            Message = "Header Card ถูกล็อก"
                        };
                    }

                    // Cancelled — reset back to Reconciliation
                    if (existing.StatusId == BssStatusConstants.CancelReconciliation)
                    {
                        existing.StatusId = BssStatusConstants.Reconciliation;
                        existing.UpdatedBy = request.CreatedBy;
                        existing.UpdatedDate = DateTime.Now;
                        _unitOfWork.TransactionReconciliationTranRepos.Update(existing);
                        await _unitOfWork.SaveChangeAsync();
                    }

                    // Return existing record for re-scanning
                    return new ReconciliationScanResponse
                    {
                        ReconciliationTranId = existing.ReconcileTranId,
                        HeaderCardCode = request.HeaderCardCode,
                        IsSuccess = true,
                        Message = "Scan successful"
                    };
                }

                // Truly reconciled (status != 11, 12) — block
                return new ReconciliationScanResponse
                {
                    HeaderCardCode = request.HeaderCardCode,
                    IsSuccess = false,
                    Message = "Header Card นี้กระทบยอดแล้ว"
                };
            }

            // 3. Calculate M7 qty — sum of qty for all bundles with same HC
            var allBundles = await _unitOfWork.TransactionPreparationRepos
                .GetListAsyncByCondition(p => p.HeaderCardCode == request.HeaderCardCode && p.IsActive == true);
            var m7Qty = allBundles.Sum(p => p.Qty);

            // 3.5 Check if any existing reconcile_tran for this HC has is_mixed_bundle flag
            var existingTran = await _unitOfWork.TransactionReconciliationTranRepos
                .GetFirstOrDefaultAsync(rt =>
                    rt.HeaderCardCode == request.HeaderCardCode
                    && rt.IsMixedBundle == true);
            var isMixedBundle = existingTran?.IsMixedBundle ?? false;

            // 4. Create ReconcileTran record
            var reconcileTran = new TransactionReconcileTran
            {
                PrepareId = preparation.PrepareId,
                HeaderCardCode = request.HeaderCardCode,
                DepartmentId = request.DepartmentId > 0 ? request.DepartmentId : 1,
                MachineHdId = null, // request.MachineId is machine master ID, not machine_hd_id
                ShiftId = request.ShiftId ?? 1,
                SorterId = request.SorterId,
                StatusId = BssStatusConstants.Reconciliation,
                IsActive = true,
                IsWarning = false,
                IsNotReconcile = false,
                IsMixedBundle = isMixedBundle,
                CountReconcile = 0,
                M7Qty = m7Qty,
                BundleNumber = allBundles.Count,
                CreatedBy = request.CreatedBy,
                CreatedDate = DateTime.Now
            };

            await _unitOfWork.TransactionReconciliationTranRepos.AddAsync(reconcileTran);

            // 5. Mark ALL preparations for this HC as reconciled
            foreach (var bundle in allBundles)
            {
                bundle.IsReconcile = true;
                bundle.IsMatchMachine = false;
                bundle.UpdatedBy = request.CreatedBy;
                bundle.UpdatedDate = DateTime.Now;
                _unitOfWork.TransactionPreparationRepos.Update(bundle);
            }

            // 6. Save
            await _unitOfWork.SaveChangeAsync();

            return new ReconciliationScanResponse
            {
                ReconciliationTranId = reconcileTran.ReconcileTranId,
                HeaderCardCode = request.HeaderCardCode,
                IsSuccess = true,
                Message = "Scan successful"
            };
        }

        public async Task<ReconciliationHeaderCardDetailResponse?> GetHeaderCardDetailAsync(long reconsileTranId)
        {
            return await _unitOfWork.TransactionReconciliationTranRepos.GetHeaderCardDetailAsync(reconsileTranId);
        }

        public async Task<EditReconciliationTranResponse> EditReconciliationTranAsync(EditReconciliationTranRequest request)
        {
            var entity = await _unitOfWork.TransactionReconciliationTranRepos.GetReconciliationTranByIdAsync(request.ReconciliationTranId);
            if (entity == null)
            {
                return new EditReconciliationTranResponse
                {
                    ReconciliationTranId = request.ReconciliationTranId,
                    IsSuccess = false,
                    Message = "ไม่พบข้อมูล"
                };
            }

            entity.HeaderCardCode = request.HeaderCardCode ?? entity.HeaderCardCode;
            entity.Remark = request.Remark;
            entity.UpdatedBy = request.UpdatedBy;
            entity.UpdatedDate = DateTime.Now;

            _unitOfWork.TransactionReconciliationTranRepos.Update(entity);
            await _unitOfWork.SaveChangeAsync();

            return new EditReconciliationTranResponse
            {
                ReconciliationTranId = entity.ReconcileTranId,
                IsSuccess = true,
                Message = "แก้ไขสำเร็จ"
            };
        }

        public async Task<DeleteReconciliationTranResponse> DeleteReconciliationTranAsync(DeleteReconciliationTranRequest request)
        {
            var entity = await _unitOfWork.TransactionReconciliationTranRepos.GetReconciliationTranByIdAsync(request.ReconciliationTranId);
            if (entity == null)
            {
                return new DeleteReconciliationTranResponse
                {
                    ReconciliationTranId = request.ReconciliationTranId,
                    IsSuccess = false,
                    Message = "ไม่พบข้อมูล"
                };
            }

            entity.IsActive = false;
            entity.Remark = request.Remark;
            entity.UpdatedBy = request.UpdatedBy;
            entity.UpdatedDate = DateTime.Now;

            _unitOfWork.TransactionReconciliationTranRepos.Update(entity);
            await _unitOfWork.SaveChangeAsync();

            return new DeleteReconciliationTranResponse
            {
                ReconciliationTranId = entity.ReconcileTranId,
                IsSuccess = true,
                Message = "ลบสำเร็จ"
            };
        }

        public async Task<ReconciliationDetailResponse?> GetReconciliationDetailAsync(long reconsileTranId)
        {
            return await _unitOfWork.TransactionReconciliationTranRepos.GetReconciliationDetailAsync(reconsileTranId);
        }

        public async Task<ReconciliationScanResponse> ReconciliationAsync(ReconciliationActionRequest request)
        {
            var entity = await _unitOfWork.TransactionReconciliationTranRepos.GetReconciliationTranByIdAsync(request.ReconciliationTranId);
            if (entity == null)
            {
                return new ReconciliationScanResponse
                {
                    ReconciliationTranId = request.ReconciliationTranId,
                    IsSuccess = false,
                    Message = "ไม่พบข้อมูล"
                };
            }

            if (entity.StatusId != BssStatusConstants.Reconciliation)
            {
                return new ReconciliationScanResponse
                {
                    ReconciliationTranId = request.ReconciliationTranId,
                    IsSuccess = false,
                    Message = "สถานะไม่ถูกต้อง ไม่สามารถกระทบยอดได้"
                };
            }

            // OTP confirm path: no denominations → copy from reconcile_tmp to reconcile (final)
            if ((request.Denominations == null || !request.Denominations.Any()) && !string.IsNullOrEmpty(request.OtpCode))
            {
                // Read ALL staging data from reconcile_tmp (machine + operator)
                var tmpRecords = await _unitOfWork.TransactionReconcileTmpRepos
                    .GetListAsyncByCondition(t => t.ReconcileTranId == entity.ReconcileTranId);

                // Copy ALL tmp → reconcile (final table), preserve IsMachineResult
                foreach (var tmp in tmpRecords)
                {
                    await _unitOfWork.TransactionReconciliationRepos.AddAsync(new TransactionReconcile
                    {
                        ReconcileTranId = entity.ReconcileTranId,
                        BnType = tmp.BnType,
                        DenomSeries = tmp.DenomSeries,
                        DenoPrice = tmp.DenoPrice,
                        Qty = tmp.TmpQty,
                        TotalValue = tmp.TmpValue,
                        AdjustType = null,
                        IsReplaceT = tmp.IsReplaceT,
                        IsReplaceC = tmp.IsReplaceC,
                        // TODO: IsBalance — column ยังไม่มีใน DB, รอทีม reconciliation-p02 เพิ่ม
                        // IsBalance = tmp.TmpValue == tmp.TmpQty * tmp.DenoPrice,
                        IsActive = true,
                        CreatedBy = request.UpdatedBy,
                        CreatedDate = DateTime.Now
                    });
                }

                // Delete ALL tmp rows
                if (tmpRecords.Any())
                {
                    await _unitOfWork.TransactionReconcileTmpRepos.RemoveManyAsync(tmpRecords);
                }

                entity.StatusId = BssStatusConstants.Reconciled;
                entity.IsWarning = false;
                entity.UpdatedBy = request.UpdatedBy;
                entity.UpdatedDate = DateTime.Now;

                _unitOfWork.TransactionReconciliationTranRepos.Update(entity);
                await _unitOfWork.SaveChangeAsync();

                return new ReconciliationScanResponse
                {
                    ReconciliationTranId = entity.ReconcileTranId,
                    IsSuccess = true,
                    Message = "ดำเนินการสำเร็จ"
                };
            }

            // Clear ALL old staging data from reconcile_tmp (machine + operator)
            var oldTmpRecords = await _unitOfWork.TransactionReconcileTmpRepos
                .GetListAsyncByCondition(t => t.ReconcileTranId == entity.ReconcileTranId);
            if (oldTmpRecords.Any())
            {
                await _unitOfWork.TransactionReconcileTmpRepos.RemoveManyAsync(oldTmpRecords);
            }

            // Insert machine data from bss_txn_machine_hd_data → tmp (is_machine_result = true)
            if (entity.MachineHdId != null)
            {
                var machineDataRows = await _unitOfWork.TransactionMachineHdDataRepos
                    .GetListAsyncByCondition(md => md.MachineHdId == entity.MachineHdId.Value);

                foreach (var md in machineDataRows)
                {
                    await _unitOfWork.TransactionReconcileTmpRepos.AddAsync(new TransactionReconcileTmp
                    {
                        ReconcileTranId = entity.ReconcileTranId,
                        HeaderCardCode = entity.HeaderCardCode ?? string.Empty,
                        BnType = md.BnType ?? string.Empty,
                        DenomSeries = md.SeriesCode ?? string.Empty,
                        DenoPrice = md.DenomValue,
                        TmpQty = md.DenomNum,
                        TmpValue = md.DenomValue * md.DenomNum,
                        IsMixedBundle = entity.IsMixedBundle,
                        IsMachineResult = true,
                        CreatedBy = request.UpdatedBy,
                        CreatedDate = DateTime.Now,
                        UpdateDate = DateTime.Now
                    });
                }
            }

            // Insert operator denomination details → tmp (is_machine_result = false)
            if (request.Denominations != null && request.Denominations.Any())
            {
                foreach (var denom in request.Denominations)
                {
                    await _unitOfWork.TransactionReconcileTmpRepos.AddAsync(new TransactionReconcileTmp
                    {
                        ReconcileTranId = entity.ReconcileTranId,
                        HeaderCardCode = denom.HeaderCardCode ?? entity.HeaderCardCode ?? string.Empty,
                        BnType = denom.BnType ?? string.Empty,
                        DenomSeries = denom.DenomSeries ?? string.Empty,
                        DenoPrice = denom.DenoPrice,
                        TmpQty = denom.Qty,
                        TmpValue = denom.TotalValue,
                        IsReplaceT = denom.IsReplaceT,
                        IsReplaceC = denom.IsReplaceC,
                        IsMixedBundle = entity.IsMixedBundle,
                        IsMachineResult = false,
                        CreatedBy = request.UpdatedBy,
                        CreatedDate = denom.CountedDate ?? DateTime.Now,
                        UpdateDate = DateTime.Now
                    });
                }
            }

            // Flush inserts to DB — AddAsync only writes to change tracker, not DB
            await _unitOfWork.SaveChangeAsync();

            // Calculate reconcile qty & total value from ALL tmp rows (machine + operator)
            var allTmpRows = await _unitOfWork.TransactionReconcileTmpRepos
                .GetListAsyncByCondition(t => t.ReconcileTranId == entity.ReconcileTranId);
            var reconcileQty = allTmpRows.Sum(t => t.TmpQty);
            entity.ReconcileQty = reconcileQty;
            entity.ReconcileTotalValue = allTmpRows.Sum(t => t.TmpValue);

            // Compare with M7 qty → set warning if mismatch
            var isWarning = entity.M7Qty.HasValue && reconcileQty != entity.M7Qty.Value;
            entity.IsWarning = isWarning;

            entity.UpdatedBy = request.UpdatedBy;
            entity.UpdatedDate = DateTime.Now;

            if (!isWarning)
            {
                // No warning → copy ALL tmp → reconcile, delete tmp, finalize
                foreach (var tmp in allTmpRows)
                {
                    await _unitOfWork.TransactionReconciliationRepos.AddAsync(new TransactionReconcile
                    {
                        ReconcileTranId = entity.ReconcileTranId,
                        BnType = tmp.BnType,
                        DenomSeries = tmp.DenomSeries,
                        DenoPrice = tmp.DenoPrice,
                        Qty = tmp.TmpQty,
                        TotalValue = tmp.TmpValue,
                        AdjustType = null,
                        IsReplaceT = tmp.IsReplaceT,
                        IsReplaceC = tmp.IsReplaceC,
                        // TODO: IsBalance — column ยังไม่มีใน DB, รอทีม reconciliation-p02 เพิ่ม
                        // IsBalance = tmp.TmpValue == tmp.TmpQty * tmp.DenoPrice,
                        IsActive = true,
                        CreatedBy = request.UpdatedBy,
                        CreatedDate = DateTime.Now
                    });
                }
                await _unitOfWork.TransactionReconcileTmpRepos.RemoveManyAsync(allTmpRows);

                entity.StatusId = BssStatusConstants.Reconciled;
            }

            _unitOfWork.TransactionReconciliationTranRepos.Update(entity);
            await _unitOfWork.SaveChangeAsync();

            if (isWarning)
            {
                return new ReconciliationScanResponse
                {
                    ReconciliationTranId = entity.ReconcileTranId,
                    IsSuccess = true,
                    Message = "WARNING"
                };
            }

            return new ReconciliationScanResponse
            {
                ReconciliationTranId = entity.ReconcileTranId,
                IsSuccess = true,
                Message = "ดำเนินการสำเร็จ"
            };
        }

        public async Task<ReconciliationScanResponse> CancelReconciliationAsync(CancelReconciliationRequest request)
        {
            var entity = await _unitOfWork.TransactionReconciliationTranRepos.GetReconciliationTranByIdAsync(request.ReconciliationTranId);
            if (entity == null)
            {
                return new ReconciliationScanResponse
                {
                    ReconciliationTranId = request.ReconciliationTranId,
                    IsSuccess = false,
                    Message = "ไม่พบข้อมูล"
                };
            }

            if (entity.StatusId != BssStatusConstants.Reconciliation)
            {
                return new ReconciliationScanResponse
                {
                    ReconciliationTranId = request.ReconciliationTranId,
                    IsSuccess = false,
                    Message = "สถานะไม่ถูกต้อง ไม่สามารถยกเลิกได้"
                };
            }

            // Clear ALL staging data from reconcile_tmp (machine + operator)
            var oldTmpRecords = await _unitOfWork.TransactionReconcileTmpRepos
                .GetListAsyncByCondition(t => t.ReconcileTranId == entity.ReconcileTranId);
            if (oldTmpRecords.Any())
            {
                await _unitOfWork.TransactionReconcileTmpRepos.RemoveManyAsync(oldTmpRecords);
            }

            // Only count toward lock when canceling a WARNING (OTP flow)
            if (entity.IsWarning == true)
            {
                entity.CountReconcile = (entity.CountReconcile ?? 0) + 1;

                // Lock if count >= 3
                if (entity.CountReconcile >= 3)
                {
                    entity.IsNotReconcile = true;
                }
            }

            // Set status to Cancel Reconciliation
            entity.StatusId = BssStatusConstants.CancelReconciliation;

            // Reset summary fields
            entity.IsWarning = false;
            entity.ReconcileQty = null;
            entity.ReconcileTotalValue = null;
            entity.Remark = request.Remark;

            entity.UpdatedBy = request.UpdatedBy;
            entity.UpdatedDate = DateTime.Now;

            _unitOfWork.TransactionReconciliationTranRepos.Update(entity);
            await _unitOfWork.SaveChangeAsync();

            return new ReconciliationScanResponse
            {
                ReconciliationTranId = entity.ReconcileTranId,
                IsSuccess = true,
                Message = entity.IsNotReconcile == true ? "Header Card ถูกล็อก" : "ยกเลิกสำเร็จ"
            };
        }

        public async Task<ReconciliationCountResponse> GetReconciliationCountAsync(ReconciliationCountRequest request)
        {
            return await _unitOfWork.TransactionReconciliationTranRepos.GetReconciliationCountAsync(request);
        }

        public async Task<object> CheckChildHeaderCardAsync(string headerCardCode)
        {
            var prepares = await _unitOfWork.TransactionPreparationRepos
                .GetListAsyncByConditionAsNoTracking(
                    p => p.HeaderCardCode == headerCardCode && p.IsActive == true,
                    p => p.MasterDenomination,
                    p => p.MasterInstitution,
                    p => p.MasterCashPoint);

            // เช็คข้อมูลเครื่องจักรจาก bss_txn_machine_hd โดยตรง
            var machineHd = await _unitOfWork.TransactionMachineHdRepos
                .GetFirstOrDefaultAsNoTrackingAsync(m => m.HeaderCardCode == headerCardCode && m.IsActive == true);

            var first = prepares.FirstOrDefault();
            return new
            {
                Exists = prepares.Count > 0,
                HasMachineData = machineHd != null,
                DenomPrice = first?.MasterDenomination?.DenominationPrice,
                BankName = first?.MasterInstitution?.InstitutionShortName,
                CashpointName = first?.MasterCashPoint?.CashpointName
            };
        }
    }
}
