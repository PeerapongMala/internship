using BSS_API.Core.Helpers;
using BSS_API.Models;
using BSS_API.Models.Entities;
using BSS_API.Models.ResponseModels;
using BSS_API.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace BSS_API.Services
{
    public class HoldingDetailService(ApplicationDbContext db) : IHoldingDetailService
    {
        private readonly ApplicationDbContext _db = db;

        public async Task<HoldingDetailResponse> GetHoldingDetailAsync(string bnType, int departmentId)
        {
            // Query pattern copied from AutoSellingRepository.GetAllDataAsync
            // Filter: status 13 (Reconciled), active, not revoked, matching bnType via preparation chain
            var items = await _db.TransactionReconcileTran
                .AsNoTracking()
                .Include(x => x.TransactionPreparation)
                    .ThenInclude(p => p!.MasterDenomination)
                .Include(x => x.MasterShift)
                .Include(x => x.TransactionReconcile)
                .Where(x =>
                    x.StatusId == 13 &&
                    x.IsActive == true &&
                    x.IsRevoke != true &&
                    x.TransactionPreparation!.TransactionContainerPrepare.MasterBanknoteType.BssBanknoteTypeCode == bnType &&
                    (departmentId <= 0 || x.DepartmentId == departmentId))
                .ToListAsync();

            var response = new HoldingDetailResponse();

            // Classification logic copied from AutoSellingRepository (lines 39-57)
            foreach (var x in items)
            {
                var qty = x.ReconcileQty ?? 0;
                var m7Qty = x.M7Qty ?? 0;
                var isMerged = x.IsMixedBundle == true;
                var isExcess = x.IsExcessMachine == true;

                var prep = x.TransactionPreparation;
                var denom = prep?.MasterDenomination?.DenominationPrice ?? 0;

                var panelRow = new HoldingDetailPanelRow
                {
                    HeaderCard = x.HeaderCardCode ?? "-",
                    Denomination = denom.ToString(),
                    SortDate = x.CreatedDate.ToString("dd/MM/yyyy HH:mm"),
                    Value = x.ReconcileTotalValue ?? 0,
                    Count = qty,
                };

                // Same logic as Auto Selling table classification
                if (isMerged && qty == 1000)
                    response.Panels.P2.Add(panelRow);       // มัดรวมครบจำนวน ครบมูลค่า
                else if (isMerged)
                    response.Panels.P5.Add(panelRow);       // มัดรวมขาด-เกิน
                else if (isExcess)
                {
                    panelRow.Count = qty;
                    response.Panels.P6.Add(panelRow);       // มัดเกินจากเครื่องจักร
                }
                else if (qty == 1000)
                    response.Panels.P1.Add(panelRow);       // มัดครบจำนวน ครบมูลค่า
                else
                    response.Panels.P4.Add(panelRow);       // มัดขาด-เกิน
            }

            // Machine excess count (excess qty = m7 - reconcile for P6 items)
            response.Panels.MachineExcessCount = items
                .Where(x => x.IsExcessMachine == true)
                .Sum(x => (x.M7Qty ?? 0) - (x.ReconcileQty ?? 0));

            // Page info: shift from first item
            var firstItem = items.FirstOrDefault();
            if (firstItem?.MasterShift != null)
            {
                response.PageInfo.Shift = firstItem.MasterShift.ShiftName ?? "-";
            }

            return response;
        }

        public async Task<List<HoldingDetailByHcRow>> GetHoldingDetailByHcAsync(string headerCards, string bnType)
        {
            var hcList = headerCards.Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(h => h.Trim())
                .ToList();

            if (hcList.Count == 0)
                return new List<HoldingDetailByHcRow>();

            // Query pattern copied from AutoSellingRepository.GetDetailAsync
            // Get reconcile detail rows for given header cards
            var trans = await _db.TransactionReconcileTran
                .AsNoTracking()
                .Include(x => x.TransactionReconcile)
                .Where(x =>
                    hcList.Contains(x.HeaderCardCode) &&
                    x.StatusId == 13 &&
                    x.IsActive == true)
                .ToListAsync();

            var rows = new List<HoldingDetailByHcRow>();
            foreach (var tran in trans)
            {
                var details = tran.TransactionReconcile?
                    .Where(v => v.IsActive == true)
                    .ToList() ?? new List<TransactionReconcile>();

                rows.AddRange(details.Select(v => new HoldingDetailByHcRow
                {
                    HeaderCard = tran.HeaderCardCode ?? "-",
                    Denomination = v.DenoPrice.ToString(),
                    Type = BanknoteTypeHelper.MapBnType(v.BnType),
                    Series = v.DenomSeries ?? "",
                    SheetCount = v.Qty,
                    Value = v.TotalValue,
                }));
            }

            return rows;
        }
    }
}
