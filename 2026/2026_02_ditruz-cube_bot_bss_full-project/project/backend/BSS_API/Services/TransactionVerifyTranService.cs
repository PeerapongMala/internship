namespace BSS_API.Services
{
    using Interface;
    using BSS_API.Repositories.Interface;
    using BSS_API.Core.Constants;
    using BSS_API.Models.Common;
    using BSS_API.Models.Entities;
    using BSS_API.Models.RequestModels;
    using BSS_API.Models.ResponseModels;

    public class TransactionVerifyTranService(IUnitOfWork unitOfWork) : ITransactionVerifyTranService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;

        public async Task<PagedData<VerifyTransactionResponse>> GetVerifyTransactionsAsync(
            PagedRequest<VerifyTransactionFilterRequest> request, CancellationToken ct = default)
        {
            return await _unitOfWork.TransactionVerifyTranRepos.GetVerifyTransactionsAsync(request, ct);
        }

        public async Task<VerifyScanResponse> ScanHeaderCardAsync(VerifyScanRequest request)
        {
            // TODO: Implement scan logic
            // 1. Validate header card exists in reconcile tran (status=Approved/16)
            // 2. Create VerifyTran record
            // 3. Update status to Verify(17)
            return new VerifyScanResponse
            {
                HeaderCardCode = request.HeaderCardCode,
                IsSuccess = true,
                Message = "Scan successful"
            };
        }

        public async Task<VerifyHeaderCardDetailResponse?> GetHeaderCardDetailAsync(long verifyTranId)
        {
            return await _unitOfWork.TransactionVerifyTranRepos.GetHeaderCardDetailAsync(verifyTranId);
        }

        public async Task<EditVerifyTranResponse> EditVerifyTranAsync(EditVerifyTranRequest request)
        {
            // TODO: Implement edit logic
            var entity = await _unitOfWork.TransactionVerifyTranRepos.GetVerifyTranByIdAsync(request.VerifyTranId);
            if (entity == null)
            {
                return new EditVerifyTranResponse
                {
                    VerifyTranId = request.VerifyTranId,
                    IsSuccess = false,
                    Message = "ไม่พบข้อมูล"
                };
            }

            entity.HeaderCardCode = request.HeaderCardCode ?? entity.HeaderCardCode;
            entity.Remark = request.Remark;
            entity.UpdatedBy = request.UpdatedBy;
            entity.UpdatedDate = DateTime.Now;

            _unitOfWork.TransactionVerifyTranRepos.Update(entity);
            await _unitOfWork.SaveChangeAsync();

            return new EditVerifyTranResponse
            {
                VerifyTranId = entity.VerifyTranId,
                IsSuccess = true,
                Message = "แก้ไขสำเร็จ"
            };
        }

        public async Task<DeleteVerifyTranResponse> DeleteVerifyTranAsync(DeleteVerifyTranRequest request)
        {
            // TODO: Implement delete logic
            var entity = await _unitOfWork.TransactionVerifyTranRepos.GetVerifyTranByIdAsync(request.VerifyTranId);
            if (entity == null)
            {
                return new DeleteVerifyTranResponse
                {
                    VerifyTranId = request.VerifyTranId,
                    IsSuccess = false,
                    Message = "ไม่พบข้อมูล"
                };
            }

            entity.IsActive = false;
            entity.Remark = request.Remark;
            entity.UpdatedBy = request.UpdatedBy;
            entity.UpdatedDate = DateTime.Now;

            _unitOfWork.TransactionVerifyTranRepos.Update(entity);
            await _unitOfWork.SaveChangeAsync();

            return new DeleteVerifyTranResponse
            {
                VerifyTranId = entity.VerifyTranId,
                IsSuccess = true,
                Message = "ลบสำเร็จ"
            };
        }

        public async Task<VerifyDetailResponse?> GetVerifyDetailAsync(long verifyTranId)
        {
            return await _unitOfWork.TransactionVerifyTranRepos.GetVerifyDetailAsync(verifyTranId);
        }

        public async Task<VerifyScanResponse> VerifyAsync(VerifyActionRequest request)
        {
            // VerifyTranId from frontend is actually ReconcileTranId (from Auto Selling page)
            var reconcileTran = await _unitOfWork.TransactionReconcileTranRepos
                .GetReconcileTranByIdAsync(request.VerifyTranId);
            if (reconcileTran == null)
            {
                return new VerifyScanResponse
                {
                    VerifyTranId = request.VerifyTranId,
                    IsSuccess = false,
                    Message = "ไม่พบข้อมูล"
                };
            }

            // Validate current status — must be Approved(16) or AutoSelling(14)
            if (reconcileTran.StatusId != BssStatusConstants.Approved && reconcileTran.StatusId != BssStatusConstants.AutoSelling)
            {
                return new VerifyScanResponse
                {
                    VerifyTranId = request.VerifyTranId,
                    IsSuccess = false,
                    Message = "สถานะไม่ถูกต้อง ไม่สามารถ Verify ได้"
                };
            }

            // Generate reference_code: YYYYMMDD(พ.ศ.) + รหัสศจธ.(2หลัก) + Shift(1หลัก) + Running(4หลัก)
            var referenceCode = await GenerateReferenceCodeAsync(
                reconcileTran.DepartmentId, reconcileTran.ShiftId);

            // Update ReconcileTran status → Verify(17)
            reconcileTran.StatusId = BssStatusConstants.Verify;
            reconcileTran.ReferenceCode = referenceCode;
            reconcileTran.UpdatedBy = request.UpdatedBy;
            reconcileTran.UpdatedDate = DateTime.Now;
            _unitOfWork.TransactionReconcileTranRepos.Update(reconcileTran);

            // Update child TransactionReconcile rows — set verify_by & verify_date
            if (reconcileTran.TransactionReconcile != null)
            {
                foreach (var rec in reconcileTran.TransactionReconcile)
                {
                    rec.VerifyBy = request.UpdatedBy;
                    rec.VerifyDate = DateTime.Now;
                    rec.UpdatedBy = request.UpdatedBy;
                    rec.UpdatedDate = DateTime.Now;
                }
            }

            await _unitOfWork.SaveChangeAsync();

            return new VerifyScanResponse
            {
                VerifyTranId = reconcileTran.ReconcileTranId,
                IsSuccess = true,
                Message = "ตรวจสอบสำเร็จ"
            };
        }

        /// <summary>
        /// สร้าง reference_code: YYYYMMDD(พ.ศ.) + รหัสศจธ.(2หลัก) + Shift(1หลัก) + Running(4หลัก)
        /// เช่น 256808150120001 → 2568/08/15 ศจธ.01 Shift=2 Running=0001
        /// Running number reset หลังเที่ยงคืนของแต่ละ dept+shift
        /// </summary>
        private async Task<string> GenerateReferenceCodeAsync(int departmentId, int shiftId)
        {
            var now = DateTime.Now;

            // Date in Buddhist Era (พ.ศ.)
            var yearBE = now.Year + 543;
            var datePrefix = $"{yearBE:D4}{now.Month:D2}{now.Day:D2}";

            // Department code (2 หลัก) — จาก bss_mst_bn_operation_center.department_code
            var dept = await _unitOfWork.DepartmentRepos
                .GetAsync(d => d.DepartmentId == departmentId);
            var deptCode = dept?.DepartmentCode?.PadLeft(2, '0').Substring(0, 2) ?? "00";

            // Shift code (1 หลัก) — จาก bss_mst_shift.shift_code
            var shift = await _unitOfWork.ShiftRepos
                .GetAsync(s => s.ShiftId == shiftId);
            var shiftCode = shift?.ShiftCode?.Trim() ?? shiftId.ToString();
            if (shiftCode.Length > 1) shiftCode = shiftCode.Substring(0, 1);

            // Prefix = YYYYMMDD + DeptCode + ShiftCode (11 หลัก)
            var prefix = $"{datePrefix}{deptCode}{shiftCode}";

            // Running number — หา max จาก reference_code ที่ขึ้นต้นด้วย prefix เดียวกัน
            var allTrans = await _unitOfWork.TransactionReconcileTranRepos
                .GetAllAsync(t => t.ReferenceCode != null
                    && t.ReferenceCode.StartsWith(prefix)
                    && t.IsActive == true);

            int maxRunning = 0;
            foreach (var t in allTrans)
            {
                if (t.ReferenceCode != null && t.ReferenceCode.Length > prefix.Length)
                {
                    var runningSuffix = t.ReferenceCode.Substring(prefix.Length);
                    if (int.TryParse(runningSuffix, out int num) && num > maxRunning)
                    {
                        maxRunning = num;
                    }
                }
            }

            var runningNo = (maxRunning + 1).ToString("D4");
            return $"{prefix}{runningNo}";
        }

        public async Task<VerifyScanResponse> CancelVerifyAsync(CancelVerifyRequest request)
        {
            // VerifyTranId from frontend is actually ReconcileTranId
            var reconcileTran = await _unitOfWork.TransactionReconcileTranRepos
                .GetReconcileTranByIdAsync(request.VerifyTranId);
            if (reconcileTran == null)
            {
                return new VerifyScanResponse
                {
                    VerifyTranId = request.VerifyTranId,
                    IsSuccess = false,
                    Message = "ไม่พบข้อมูล"
                };
            }

            // Validate current status — must be Verify(17)
            if (reconcileTran.StatusId != BssStatusConstants.Verify)
            {
                return new VerifyScanResponse
                {
                    VerifyTranId = request.VerifyTranId,
                    IsSuccess = false,
                    Message = "สถานะไม่ถูกต้อง ไม่สามารถยกเลิกได้"
                };
            }

            // Revert ReconcileTran status → Approved(16)
            reconcileTran.StatusId = BssStatusConstants.Approved;
            reconcileTran.Remark = request.Remark;
            reconcileTran.UpdatedBy = request.UpdatedBy;
            reconcileTran.UpdatedDate = DateTime.Now;
            _unitOfWork.TransactionReconcileTranRepos.Update(reconcileTran);

            // Clear verify_by & verify_date on child TransactionReconcile rows
            if (reconcileTran.TransactionReconcile != null)
            {
                foreach (var rec in reconcileTran.TransactionReconcile)
                {
                    rec.VerifyBy = null;
                    rec.VerifyDate = null;
                    rec.UpdatedBy = request.UpdatedBy;
                    rec.UpdatedDate = DateTime.Now;
                }
            }

            await _unitOfWork.SaveChangeAsync();

            return new VerifyScanResponse
            {
                VerifyTranId = reconcileTran.ReconcileTranId,
                IsSuccess = true,
                Message = "ยกเลิกการตรวจสอบสำเร็จ"
            };
        }

        public async Task<VerifyCountResponse> GetVerifyCountAsync(VerifyCountRequest request)
        {
            return await _unitOfWork.TransactionVerifyTranRepos.GetVerifyCountAsync(request);
        }
    }
}
