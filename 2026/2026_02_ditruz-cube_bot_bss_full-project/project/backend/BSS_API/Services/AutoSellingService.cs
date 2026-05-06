namespace BSS_API.Services
{
    using Interface;
    using Repositories.Interface;
    using Core.Constants;
    using Models.RequestModels;
    using Models.ResponseModels;

    public class AutoSellingService(IUnitOfWork unitOfWork) : IAutoSellingService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;

        public async Task<AutoSellingAllDataResponse> GetAllDataAsync(
            AutoSellingFilterRequest filter, CancellationToken ct = default)
        {
            return await _unitOfWork.AutoSellingRepos.GetAllDataAsync(filter, ct);
        }

        public async Task<AutoSellingDetailResponse?> GetDetailAsync(
            string headerCardCode, CancellationToken ct = default)
        {
            return await _unitOfWork.AutoSellingRepos.GetDetailAsync(headerCardCode, ct);
        }

        public async Task<AutoSellingActionResponse> SaveAdjustmentAsync(AutoSellingAdjustmentRequest request)
        {
            var ok = await _unitOfWork.AutoSellingRepos.SaveAdjustmentAsync(request);
            return new AutoSellingActionResponse
            {
                IsSuccess = ok,
                Message = ok ? "บันทึกสำเร็จ" : "ไม่พบรายการ"
            };
        }

        public async Task<AutoSellingActionResponse> MergeBundlesAsync(AutoSellingMergeRequest request)
        {
            // TODO: Implement merge logic
            // 1. Validate both items exist in tableA
            // 2. Validate consecutive Header Cards + same counting file
            // 3. Merge qty from MergeId into KeepId
            // 4. Deactivate MergeId record
            // 5. SaveChanges

            await Task.CompletedTask;
            return new AutoSellingActionResponse { IsSuccess = true, Message = "รวมมัดสำเร็จ" };
        }

        public async Task<AutoSellingValidateSummaryResponse> ValidateSummaryAsync(AutoSellingValidateSummaryRequest request)
        {
            if (request.SelectedIds == null || request.SelectedIds.Count == 0)
            {
                return new AutoSellingValidateSummaryResponse
                {
                    IsValid = false,
                    Message = "กรุณาเลือกรายการอย่างน้อย 1 รายการ"
                };
            }

            // Query selected reconcile tran records
            var reconcileTrans = await _unitOfWork.TransactionReconcileTranRepos
                .GetListAsyncByCondition(x => request.SelectedIds.Contains(x.ReconcileTranId)
                    && x.IsActive == true);

            var validIds = new List<long>();
            var invalidIds = new List<long>();

            // เช็ค status ที่อนุญาต: 14 (Auto Selling) หรือ 16 (Approved) เท่านั้น
            var allowedStatuses = new[] { BssStatusConstants.AutoSelling, BssStatusConstants.Approved };
            var invalidStatusItems = reconcileTrans
                .Where(x => !allowedStatuses.Contains(x.StatusId))
                .ToList();

            if (invalidStatusItems.Any())
            {
                return new AutoSellingValidateSummaryResponse
                {
                    IsValid = false,
                    Message = "ไม่สามารถส่ง Verify ได้ เนื่องจากมีรายการที่สถานะไม่ถูกต้อง (ต้องเป็น Auto Selling หรือ อนุมัติ เท่านั้น)"
                };
            }

            foreach (var tran in reconcileTrans)
            {
                var qty = tran.ReconcileQty ?? 0;
                var m7Qty = tran.M7Qty ?? 0;
                var isMerged = tran.IsMixedBundle == true;
                var isExcess = tran.IsExcessMachine == true;

                // ใช้ logic เดียวกับ AutoSellingRepository.GetAllDataAsync
                // Table1 (qty==1000) → Verify ได้
                // Table2 (isMerged && qty==m7Qty) → Verify ได้
                // TableA (qty!=1000), TableB (isMerged && qty!=m7Qty), TableC (isExcess) → block
                bool isComplete = isMerged
                    ? (m7Qty > 0 && qty == m7Qty)
                    : (qty == 1000);

                if (isExcess || !isComplete)
                {
                    invalidIds.Add(tran.ReconcileTranId);
                }
                else
                {
                    validIds.Add(tran.ReconcileTranId);
                }
            }

            if (invalidIds.Count > 0)
            {
                return new AutoSellingValidateSummaryResponse
                {
                    IsValid = false,
                    Message = "ไม่สามารถส่ง Verify ได้ เนื่องจากมีรายการขาด-เกิน หรือเกินจากเครื่องจักร"
                };
            }

            return new AutoSellingValidateSummaryResponse
            {
                IsValid = true,
                Message = "ตรวจสอบสำเร็จ",
                ValidIds = validIds
            };
        }

        public async Task<AutoSellingActionResponse> CancelSendAsync(AutoSellingCancelSendRequest request)
        {
            var ok = await _unitOfWork.AutoSellingRepos.CancelSendAsync(request);
            return new AutoSellingActionResponse
            {
                IsSuccess = ok,
                Message = ok ? "ยกเลิกสำเร็จ" : "ไม่พบรายการ"
            };
        }

        public async Task<AutoSellingActionResponse> ChangeShiftAsync(AutoSellingChangeShiftRequest request)
        {
            var ok = await _unitOfWork.AutoSellingRepos.ChangeShiftAsync(request);
            return new AutoSellingActionResponse
            {
                IsSuccess = ok,
                Message = ok ? "เปลี่ยน Shift สำเร็จ" : "ไม่พบรายการ"
            };
        }

        public async Task<AutoSellingActionResponse> SaveInsertReplaceAsync(AutoSellingInsertReplaceRequest request)
        {
            var ok = await _unitOfWork.AutoSellingRepos.SaveInsertReplaceAsync(request);
            return new AutoSellingActionResponse
            {
                IsSuccess = ok,
                Message = ok ? "บันทึกแทรกแทนสำเร็จ" : "ไม่พบรายการ"
            };
        }

        public async Task<AutoSellingActionResponse> SaveAdjustOffsetAsync(AdjustOffsetRequest request)
        {
            var ok = await _unitOfWork.AutoSellingRepos.SaveAdjustOffsetAsync(request);
            return new AutoSellingActionResponse
            {
                IsSuccess = ok,
                Message = ok ? "ส่งคำขออนุมัติ Adjust Offset สำเร็จ" : "ไม่พบรายการ"
            };
        }

    }
}
