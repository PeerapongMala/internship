namespace BSS_API.Services
{
    using Interface;
    using BSS_API.Core.Constants;
    using BSS_API.Repositories.Interface;
    using BSS_API.Models.Common;
    using BSS_API.Models.Entities;
    using BSS_API.Models.RequestModels;
    using BSS_API.Models.ResponseModels;

    public class TransactionApproveManualKeyInTranService(IUnitOfWork unitOfWork) : ITransactionApproveManualKeyInTranService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;

        // Approve: source status → target status
        private static readonly Dictionary<int, int> ApproveTargetMap = new()
        {
            { BssStatusConstants.ManualKeyIn, BssStatusConstants.Approved },                     // 24 → 16
            { BssStatusConstants.Edited, BssStatusConstants.Approved },                          // 20 → 16
            { BssStatusConstants.AdjustOffset, BssStatusConstants.Approved },                    // 15 → 16
            { BssStatusConstants.EditedApproved, BssStatusConstants.Approved },                  // 27 → 16
            { BssStatusConstants.CancelSent, BssStatusConstants.ApprovedCancel },                // 23 → 30
            { BssStatusConstants.CancelSentDeniedEdited, BssStatusConstants.ApprovedCancel },    // 22 → 30
            { BssStatusConstants.CancelSentDeniedApproved, BssStatusConstants.ApprovedCancel },  // 29 → 30
            { BssStatusConstants.CancelSentManualKeyIn, BssStatusConstants.ApprovedCancel },     // 26 → 30
        };

        // Deny: source status → target status (เฉพาะที่ชัดจาก State Diagram)
        private static readonly Dictionary<int, int> DenyTargetMap = new()
        {
            { BssStatusConstants.ManualKeyIn, BssStatusConstants.DeniedManualKeyIn },            // 24 → 25
            { BssStatusConstants.Edited, BssStatusConstants.DeniedEdited },                      // 20 → 21
            { BssStatusConstants.EditedApproved, BssStatusConstants.DeniedEditedApproved },      // 27 → 28
        };

        public async Task<PagedData<ApproveManualKeyInTransactionResponse>> GetApproveManualKeyInTransactionsAsync(
            PagedRequest<ApproveManualKeyInTransactionFilterRequest> request, CancellationToken ct = default)
        {
            return await _unitOfWork.TransactionApproveManualKeyInTranRepos.GetApproveManualKeyInTransactionsAsync(request, ct);
        }

        public async Task<ApproveManualKeyInHeaderCardDetailResponse?> GetHeaderCardDetailAsync(long approveManualKeyInTranId)
        {
            return await _unitOfWork.TransactionApproveManualKeyInTranRepos.GetHeaderCardDetailAsync(approveManualKeyInTranId);
        }

        public async Task<EditApproveManualKeyInTranResponse> EditApproveManualKeyInTranAsync(EditApproveManualKeyInTranRequest request)
        {
            var entity = await _unitOfWork.TransactionApproveManualKeyInTranRepos
                .GetReconcileTranByIdAsync(request.ApproveManualKeyInTranId);

            if (entity == null)
            {
                return new EditApproveManualKeyInTranResponse
                {
                    ApproveManualKeyInTranId = request.ApproveManualKeyInTranId,
                    IsSuccess = false,
                    Message = "ไม่พบข้อมูล"
                };
            }

            entity.HeaderCardCode = request.HeaderCardCode ?? entity.HeaderCardCode;
            entity.Remark = request.Remark;
            entity.UpdatedBy = request.UpdatedBy;
            entity.UpdatedDate = DateTime.Now;

            await _unitOfWork.SaveChangeAsync();

            return new EditApproveManualKeyInTranResponse
            {
                ApproveManualKeyInTranId = entity.ReconcileTranId,
                IsSuccess = true,
                Message = "แก้ไขสำเร็จ"
            };
        }

        public async Task<DeleteApproveManualKeyInTranResponse> DeleteApproveManualKeyInTranAsync(DeleteApproveManualKeyInTranRequest request)
        {
            var entity = await _unitOfWork.TransactionApproveManualKeyInTranRepos
                .GetReconcileTranByIdAsync(request.ApproveManualKeyInTranId);

            if (entity == null)
            {
                return new DeleteApproveManualKeyInTranResponse
                {
                    ApproveManualKeyInTranId = request.ApproveManualKeyInTranId,
                    IsSuccess = false,
                    Message = "ไม่พบข้อมูล"
                };
            }

            entity.IsActive = false;
            entity.Remark = request.Remark;
            entity.UpdatedBy = request.UpdatedBy;
            entity.UpdatedDate = DateTime.Now;

            await _unitOfWork.SaveChangeAsync();

            return new DeleteApproveManualKeyInTranResponse
            {
                ApproveManualKeyInTranId = entity.ReconcileTranId,
                IsSuccess = true,
                Message = "ลบสำเร็จ"
            };
        }

        public async Task<ApproveManualKeyInDetailResponse?> GetApproveManualKeyInDetailAsync(long approveManualKeyInTranId)
        {
            return await _unitOfWork.TransactionApproveManualKeyInTranRepos.GetApproveManualKeyInDetailAsync(approveManualKeyInTranId);
        }

        public async Task<ApproveManualKeyInScanResponse> ApproveAsync(ApproveManualKeyInActionRequest request)
        {
            return await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                // 1. Load reconcile_tran and verify status = ManualKeyIn (24)
                var tran = await _unitOfWork.TransactionApproveManualKeyInTranRepos
                    .GetReconcileTranByIdAsync(request.ApproveManualKeyInTranId);

                if (tran == null)
                {
                    return new ApproveManualKeyInScanResponse
                    {
                        ApproveManualKeyInTranId = request.ApproveManualKeyInTranId,
                        IsSuccess = false,
                        Message = "ไม่พบข้อมูลรายการ"
                    };
                }

                if (!ApproveTargetMap.TryGetValue(tran.StatusId, out var targetStatus))
                {
                    return new ApproveManualKeyInScanResponse
                    {
                        ApproveManualKeyInTranId = request.ApproveManualKeyInTranId,
                        IsSuccess = false,
                        Message = "สถานะไม่ถูกต้อง ไม่สามารถอนุมัติได้"
                    };
                }

                // 2. Copy manual_tmp → reconcile only for ManualKeyIn (24)
                if (tran.StatusId == BssStatusConstants.ManualKeyIn)
                {
                    var manualTmpRows = await _unitOfWork.TransactionApproveManualKeyInTranRepos
                        .GetManualTmpByTranIdAsync(tran.ReconcileTranId);

                    foreach (var tmp in manualTmpRows.Where(x => x.TmpAction == "ADD"))
                    {
                        var reconcile = new TransactionReconcile
                        {
                            ReconcileTranId = tran.ReconcileTranId,
                            BnType = tmp.BnType,
                            DenomSeries = tmp.DenomSeries,
                            DenoPrice = tmp.DenoPrice,
                            Qty = tmp.TmpQty,
                            TotalValue = tmp.TmpValue,
                            ManualBy = request.SupervisorId,
                            ManualDate = DateTime.Now,
                            IsMachineResult = false,
                            IsActive = true,
                            CreatedBy = request.UpdatedBy,
                            CreatedDate = DateTime.Now,
                        };
                        await _unitOfWork.TransactionReconciliationRepos.AddAsync(reconcile);
                    }
                }

                // 3. Update reconcile_tran status
                tran.ApproveBy = request.UpdatedBy;
                tran.ApproveDate = DateTime.Now;
                tran.StatusId = targetStatus;
                tran.Remark = request.Remark;
                tran.UpdatedBy = request.UpdatedBy;
                tran.UpdatedDate = DateTime.Now;

                await _unitOfWork.SaveChangeAsync();

                return new ApproveManualKeyInScanResponse
                {
                    ApproveManualKeyInTranId = tran.ReconcileTranId,
                    IsSuccess = true,
                    Message = "อนุมัติสำเร็จ"
                };
            });
        }

        public async Task<ApproveManualKeyInScanResponse> DenyAsync(CancelApproveManualKeyInRequest request)
        {
            var tran = await _unitOfWork.TransactionApproveManualKeyInTranRepos
                .GetReconcileTranByIdAsync(request.ApproveManualKeyInTranId);

            if (tran == null)
            {
                return new ApproveManualKeyInScanResponse
                {
                    ApproveManualKeyInTranId = request.ApproveManualKeyInTranId,
                    IsSuccess = false,
                    Message = "ไม่พบข้อมูลรายการ"
                };
            }

            if (!DenyTargetMap.TryGetValue(tran.StatusId, out var targetStatus))
            {
                return new ApproveManualKeyInScanResponse
                {
                    ApproveManualKeyInTranId = request.ApproveManualKeyInTranId,
                    IsSuccess = false,
                    Message = "สถานะไม่ถูกต้อง ไม่สามารถปฏิเสธได้"
                };
            }

            tran.StatusId = targetStatus;
            tran.Remark = request.Remark;
            tran.UpdatedBy = request.UpdatedBy;
            tran.UpdatedDate = DateTime.Now;

            await _unitOfWork.SaveChangeAsync();

            return new ApproveManualKeyInScanResponse
            {
                ApproveManualKeyInTranId = tran.ReconcileTranId,
                IsSuccess = true,
                Message = "ปฏิเสธสำเร็จ"
            };
        }

        public async Task<ApproveManualKeyInCountResponse> GetApproveManualKeyInCountAsync(ApproveManualKeyInCountRequest request)
        {
            return await _unitOfWork.TransactionApproveManualKeyInTranRepos.GetApproveManualKeyInCountAsync(request);
        }
    }
}
