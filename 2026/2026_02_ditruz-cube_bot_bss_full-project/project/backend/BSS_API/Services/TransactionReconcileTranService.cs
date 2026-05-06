namespace BSS_API.Services
{
    using Interface;
    using BSS_API.Repositories.Interface;
    using BSS_API.Models.Common;
    using BSS_API.Models.Entities;
    using BSS_API.Models.RequestModels;
    using BSS_API.Models.ResponseModels;

    public class TransactionReconcileTranService(IUnitOfWork unitOfWork) : ITransactionReconcileTranService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;

        public async Task<PagedData<ReconcileTransactionResponse>> GetReconcileTransactionsAsync(
            PagedRequest<ReconcileTransactionFilterRequest> request, CancellationToken ct = default)
        {
            return await _unitOfWork.TransactionReconcileTranRepos.GetReconcileTransactionsAsync(request, ct);
        }

        public async Task<ReconcileScanResponse> ScanHeaderCardAsync(ReconcileScanRequest request)
        {
            // TODO: Implement scan logic
            // 1. Validate header card exists in preparation
            // 2. Create ReconcileTran record
            // 3. Set IsReconcile=true on related Preparation
            return new ReconcileScanResponse
            {
                HeaderCardCode = request.HeaderCardCode,
                IsSuccess = true,
                Message = "Scan successful"
            };
        }

        public async Task<ReconcileHeaderCardDetailResponse?> GetHeaderCardDetailAsync(long reconcileTranId)
        {
            return await _unitOfWork.TransactionReconcileTranRepos.GetHeaderCardDetailAsync(reconcileTranId);
        }

        public async Task<EditReconcileTranResponse> EditReconcileTranAsync(EditReconcileTranRequest request)
        {
            // TODO: Implement edit logic
            var entity = await _unitOfWork.TransactionReconcileTranRepos.GetReconcileTranByIdAsync(request.ReconcileTranId);
            if (entity == null)
            {
                return new EditReconcileTranResponse
                {
                    ReconcileTranId = request.ReconcileTranId,
                    IsSuccess = false,
                    Message = "ไม่พบข้อมูล"
                };
            }

            entity.HeaderCardCode = request.HeaderCardCode ?? entity.HeaderCardCode;
            entity.Remark = request.Remark;
            entity.UpdatedBy = request.UpdatedBy;
            entity.UpdatedDate = DateTime.Now;

            _unitOfWork.TransactionReconcileTranRepos.Update(entity);
            await _unitOfWork.SaveChangeAsync();

            return new EditReconcileTranResponse
            {
                ReconcileTranId = entity.ReconcileTranId,
                IsSuccess = true,
                Message = "แก้ไขสำเร็จ"
            };
        }

        public async Task<DeleteReconcileTranResponse> DeleteReconcileTranAsync(DeleteReconcileTranRequest request)
        {
            // TODO: Implement delete logic
            var entity = await _unitOfWork.TransactionReconcileTranRepos.GetReconcileTranByIdAsync(request.ReconcileTranId);
            if (entity == null)
            {
                return new DeleteReconcileTranResponse
                {
                    ReconcileTranId = request.ReconcileTranId,
                    IsSuccess = false,
                    Message = "ไม่พบข้อมูล"
                };
            }

            entity.IsActive = false;
            entity.Remark = request.Remark;
            entity.UpdatedBy = request.UpdatedBy;
            entity.UpdatedDate = DateTime.Now;

            _unitOfWork.TransactionReconcileTranRepos.Update(entity);
            await _unitOfWork.SaveChangeAsync();

            return new DeleteReconcileTranResponse
            {
                ReconcileTranId = entity.ReconcileTranId,
                IsSuccess = true,
                Message = "ลบสำเร็จ"
            };
        }

        public async Task<ReconcileDetailResponse?> GetReconcileDetailAsync(long reconcileTranId)
        {
            return await _unitOfWork.TransactionReconcileTranRepos.GetReconcileDetailAsync(reconcileTranId);
        }

        public async Task<ReconcileScanResponse> ReconcileAsync(ReconcileActionRequest request)
        {
            // TODO: Implement reconcile logic
            // 1. Compare preparation data vs machine data
            // 2. Detect mismatches → set IsWarning
            // 3. Update status: Reconciliation(11) → Reconciled(13)
            // 4. OTP verification
            return new ReconcileScanResponse
            {
                ReconcileTranId = request.ReconcileTranId,
                IsSuccess = true,
                Message = "กระทบยอดสำเร็จ"
            };
        }

        public async Task<ReconcileScanResponse> CancelReconcileAsync(CancelReconcileRequest request)
        {
            // TODO: Implement cancel reconcile logic
            // 1. Update status: → CancelReconciliation(12)
            // 2. OTP verification
            return new ReconcileScanResponse
            {
                ReconcileTranId = request.ReconcileTranId,
                IsSuccess = true,
                Message = "ยกเลิกกระทบยอดสำเร็จ"
            };
        }

        public async Task<ReconcileCountResponse> GetReconcileCountAsync(ReconcileCountRequest request)
        {
            return await _unitOfWork.TransactionReconcileTranRepos.GetReconcileCountAsync(request);
        }

        public async Task<EditPrepareHcResponse> EditPrepareHcAsync(EditPrepareHcRequest request)
        {
            try
            {
                // OTP is validated on frontend via BssMail/ValidateMail before calling this endpoint

                var entity = await _unitOfWork.TransactionPreparationRepos
                    .GetAsync(x => x.PrepareId == request.PrepareId, tracked: true);
                if (entity == null)
                {
                    return new EditPrepareHcResponse
                    {
                        PrepareId = request.PrepareId,
                        IsSuccess = false,
                        Message = "ไม่พบข้อมูล"
                    };
                }

                entity.HeaderCardCode = request.HeaderCardCode ?? entity.HeaderCardCode;
                entity.UpdatedBy = request.UpdatedBy;
                entity.UpdatedDate = DateTime.Now;

                _unitOfWork.TransactionPreparationRepos.Update(entity);
                await _unitOfWork.SaveChangeAsync();

                return new EditPrepareHcResponse
                {
                    PrepareId = request.PrepareId,
                    IsSuccess = true,
                    Message = "แก้ไข Header Card สำเร็จ"
                };
            }
            catch (Exception ex)
            {
                return new EditPrepareHcResponse
                {
                    PrepareId = request.PrepareId,
                    IsSuccess = false,
                    Message = $"เกิดข้อผิดพลาด: {ex.Message}"
                };
            }
        }

        public async Task<EditMachineHcResponse> EditMachineHcAsync(EditMachineHcRequest request)
        {
            try
            {
                // OTP is validated on frontend via BssMail/ValidateMail before calling this endpoint


                var entity = await _unitOfWork.TransactionMachineHdRepos.GetFirstOrDefaultAsync(x => x.MachineHdId == request.MachineHdId);
                if (entity == null)
                {
                    return new EditMachineHcResponse
                    {
                        MachineHdId = request.MachineHdId,
                        IsSuccess = false,
                        Message = "ไม่พบข้อมูล"
                    };
                }

                // Update HeaderCardCode and metadata
                entity.HeaderCardCode = request.HeaderCardCode ?? entity.HeaderCardCode;
                entity.UpdatedBy = request.UpdatedBy;
                entity.UpdatedDate = DateTime.Now;

                _unitOfWork.TransactionMachineHdRepos.Update(entity);
                await _unitOfWork.SaveChangeAsync();

                return new EditMachineHcResponse
                {
                    MachineHdId = entity.MachineHdId,
                    IsSuccess = true,
                    Message = "แก้ไข Header Card สำเร็จ"
                };
            }
            catch (Exception ex)
            {
                return new EditMachineHcResponse
                {
                    MachineHdId = request.MachineHdId,
                    IsSuccess = false,
                    Message = $"เกิดข้อผิดพลาด: {ex.Message}"
                };
            }
        }
    }
}
