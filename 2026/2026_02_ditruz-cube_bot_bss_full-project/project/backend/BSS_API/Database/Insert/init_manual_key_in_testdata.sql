/* ============================================================
   Test Data for Manual Key-In Feature

   Prerequisites: Master data must already exist
   - bss_mst_status (status_id 1-30)
   - bss_mst_user (at least user_id 1)
   - bss_mst_institution (at least 1 record)
   - bss_mst_cashpoint (at least 1 record)
   - bss_mst_denomination (at least 1 record)
   - bss_mst_machine (at least 1 record)
   - bss_mst_bn_type (at least 1 record)
   - bss_mst_company_department (department_id = 1)

   Run this AFTER all master data inserts.
   ============================================================ */

USE BSSDEVDB;
GO

/* ============================================================
   Step 1: Check what master data exists (for reference)
   ============================================================ */
-- SELECT TOP 5 * FROM bss_mst_institution WHERE is_active = 1;
-- SELECT TOP 5 * FROM bss_mst_cashpoint WHERE is_active = 1;
-- SELECT TOP 5 * FROM bss_mst_denomination WHERE is_active = 1;
-- SELECT TOP 5 * FROM bss_mst_machine WHERE is_active = 1;
-- SELECT TOP 5 * FROM bss_mst_bn_type WHERE is_active = 1;
-- SELECT TOP 5 * FROM bss_mst_shift WHERE is_active = 1;
-- SELECT TOP 5 * FROM bss_mst_user WHERE is_active = 1;

/* ============================================================
   Step 2: Insert Container Prepare (parent of bss_txn_prepare)
   - Adjust department_id, machine_id, bntype_id to match your master data
   ============================================================ */

DECLARE @DepartmentId INT = 1;     -- adjust to existing department
DECLARE @MachineId INT = 1;        -- adjust to existing machine
DECLARE @BnTypeId INT = 1;         -- adjust to existing bn_type
DECLARE @InstId INT = 1;           -- adjust to existing institution (e.g. BBL)
DECLARE @CashpointId INT = 1;      -- adjust to existing cashpoint
DECLARE @DenoId INT = 1;           -- adjust to existing denomination
DECLARE @UserId INT = 1;           -- adjust to existing user
DECLARE @ShiftId INT = 0;          -- adjust to existing shift (0 = default)

DECLARE @ContainerPrepareId BIGINT;
DECLARE @PrepareId1 BIGINT;
DECLARE @PrepareId2 BIGINT;
DECLARE @TranId1 BIGINT;
DECLARE @TranId2 BIGINT;

/* ---- Container Prepare #1: for header card 0054309830 ---- */
INSERT INTO bss_txn_container_prepare
    (department_id, machine_id, container_code, bntype_id, is_active, created_by, created_date)
VALUES
    (@DepartmentId, @MachineId, N'MK-TEST01', @BnTypeId, 1, @UserId, GETDATE());

SET @ContainerPrepareId = SCOPE_IDENTITY();

/* ============================================================
   Step 3: Insert Prepare records (bss_txn_prepare)
   - header_card_code is the key lookup field for GetHeaderCardInfo
   - status_id = 9 (Prepared) — ready for Manual Key-In
   ============================================================ */

-- Prepare #1: Header Card 0054309830
INSERT INTO bss_txn_prepare
    (container_prepare_id, header_card_code, package_code, bundle_code,
     inst_id, cashpoint_id, deno_id, qty, status_id,
     prepare_date, is_active, created_by, created_date)
VALUES
    (@ContainerPrepareId, N'0054309830', N'PKG-MK001', N'BND-MK001',
     @InstId, @CashpointId, @DenoId, 100, 9,
     DATEADD(HOUR, -2, GETDATE()), 1, @UserId, DATEADD(HOUR, -4, GETDATE()));

SET @PrepareId1 = SCOPE_IDENTITY();

-- Prepare #2: Header Card 0054941520 (another test case)
INSERT INTO bss_txn_prepare
    (container_prepare_id, header_card_code, package_code, bundle_code,
     inst_id, cashpoint_id, deno_id, qty, status_id,
     prepare_date, is_active, created_by, created_date)
VALUES
    (@ContainerPrepareId, N'0054941520', N'PKG-MK002', N'BND-MK002',
     @InstId, @CashpointId, @DenoId, 200, 9,
     DATEADD(HOUR, -1, GETDATE()), 1, @UserId, DATEADD(HOUR, -3, GETDATE()));

SET @PrepareId2 = SCOPE_IDENTITY();

/* ============================================================
   Step 4: Insert Manual Key-In Transaction (bss_txn_approve_manual_key_in_tran)
   - These are created when user saves manual key-in data
   - status_id = 24 (ManualKeyIn) — waiting for approval
   ============================================================ */

-- Tran #1 for PrepareId1 (header card 0054309830)
INSERT INTO bss_txn_approve_manual_key_in_tran
    (prepare_id, department_id, machine_hd_id, header_card_code,
     m7_qty, manual_key_in_qty, status_id, shift_id, sorter_id,
     is_active, is_display, is_revoke, is_warning, is_not_approved,
     count_manual_key_in, created_by, created_date)
VALUES
    (@PrepareId1, @DepartmentId, @MachineId, N'0054309830',
     100, 103, 24, @ShiftId, NULL,
     1, 1, 0, 0, 0,
     1, @UserId, GETDATE());

SET @TranId1 = SCOPE_IDENTITY();

-- Tran #2 for PrepareId2 (header card 0054941520)
INSERT INTO bss_txn_approve_manual_key_in_tran
    (prepare_id, department_id, machine_hd_id, header_card_code,
     m7_qty, manual_key_in_qty, status_id, shift_id, sorter_id,
     is_active, is_display, is_revoke, is_warning, is_not_approved,
     count_manual_key_in, created_by, created_date)
VALUES
    (@PrepareId2, @DepartmentId, @MachineId, N'0054941520',
     200, 210, 24, @ShiftId, NULL,
     1, 1, 0, 0, 0,
     1, @UserId, GETDATE());

SET @TranId2 = SCOPE_IDENTITY();

/* ============================================================
   Step 5: Insert Manual Key-In Detail records (bss_txn_approve_manual_key_in)
   - denom_series format: "{Denom}/{Series}" e.g. "1000/17"
   - bn_type: e.g. "ดี", "เสีย", "Reject", "ปลอม", "ชำรุด"
   - qty: number of banknotes
   - total_value: qty * denom
   ============================================================ */

-- Details for Tran #1 (header card 0054309830)
INSERT INTO bss_txn_approve_manual_key_in
    (approve_manual_key_in_tran_id, bn_type, denom_series, qty, total_value,
     is_normal, is_addon, is_endjam, is_active, manual_by, manual_date,
     created_by, created_date)
VALUES
    (@TranId1, N'ดี',     N'1000/17', 5,   5000,   1, 0, 0, 1, @UserId, GETDATE(), @UserId, GETDATE()),
    (@TranId1, N'เสีย',   N'1000/17', 993, 993000, 1, 0, 0, 1, @UserId, GETDATE(), @UserId, GETDATE()),
    (@TranId1, N'Reject',  N'1000/17', 1,   1000,   1, 0, 0, 1, @UserId, GETDATE(), @UserId, GETDATE()),
    (@TranId1, N'ดี',     N'500/17',  120, 60000,  1, 0, 0, 1, @UserId, GETDATE(), @UserId, GETDATE()),
    (@TranId1, N'ดี',     N'1000/16', 50,  50000,  1, 0, 0, 1, @UserId, GETDATE(), @UserId, GETDATE()),
    (@TranId1, N'เสีย',   N'500/17',  30,  15000,  1, 0, 0, 1, @UserId, GETDATE(), @UserId, GETDATE()),
    (@TranId1, N'ดี',     N'100/17',  200, 20000,  1, 0, 0, 1, @UserId, GETDATE(), @UserId, GETDATE());

-- Details for Tran #2 (header card 0054941520)
INSERT INTO bss_txn_approve_manual_key_in
    (approve_manual_key_in_tran_id, bn_type, denom_series, qty, total_value,
     is_normal, is_addon, is_endjam, is_active, manual_by, manual_date,
     created_by, created_date)
VALUES
    (@TranId2, N'ดี',     N'1000/17', 250, 250000, 1, 0, 0, 1, @UserId, GETDATE(), @UserId, GETDATE()),
    (@TranId2, N'เสีย',   N'1000/17', 50,  50000,  1, 0, 0, 1, @UserId, GETDATE(), @UserId, GETDATE()),
    (@TranId2, N'Reject',  N'1000/17', 3,   3000,   1, 0, 0, 1, @UserId, GETDATE(), @UserId, GETDATE()),
    (@TranId2, N'ดี',     N'500/17',  500, 250000, 1, 0, 0, 1, @UserId, GETDATE(), @UserId, GETDATE()),
    (@TranId2, N'เสีย',   N'500/17',  100, 50000,  1, 0, 0, 1, @UserId, GETDATE(), @UserId, GETDATE()),
    (@TranId2, N'ดี',     N'100/17',  1500, 150000, 1, 0, 0, 1, @UserId, GETDATE(), @UserId, GETDATE()),
    (@TranId2, N'เสีย',   N'100/17',  200, 20000,  1, 0, 0, 1, @UserId, GETDATE(), @UserId, GETDATE()),
    (@TranId2, N'ดี',     N'50/17',   2000, 100000, 1, 0, 0, 1, @UserId, GETDATE(), @UserId, GETDATE()),
    (@TranId2, N'ดี',     N'20/17',   3000, 60000,  1, 0, 0, 1, @UserId, GETDATE(), @UserId, GETDATE()),
    (@TranId2, N'Reject',  N'20/17',   30,  600,    1, 0, 0, 1, @UserId, GETDATE(), @UserId, GETDATE());

/* ============================================================
   Verification Queries — run these to check the data
   ============================================================ */

PRINT '=== Container Prepare ===';
SELECT TOP 5 * FROM bss_txn_container_prepare WHERE container_code LIKE 'MK-TEST%' ORDER BY container_prepare_id DESC;

PRINT '=== Prepare (Header Cards) ===';
SELECT TOP 5 * FROM bss_txn_prepare WHERE header_card_code IN ('0054309830', '0054941520') ORDER BY prepare_id DESC;

PRINT '=== Manual Key-In Tran ===';
SELECT TOP 5 * FROM bss_txn_approve_manual_key_in_tran WHERE header_card_code IN ('0054309830', '0054941520') ORDER BY approve_manual_key_in_tran_id DESC;

PRINT '=== Manual Key-In Details ===';
SELECT d.*
FROM bss_txn_approve_manual_key_in d
INNER JOIN bss_txn_approve_manual_key_in_tran t ON d.approve_manual_key_in_tran_id = t.approve_manual_key_in_tran_id
WHERE t.header_card_code IN ('0054309830', '0054941520')
ORDER BY d.approve_manual_key_in_tran_id, d.denom_series;

/* ============================================================
   Cleanup (if needed) — uncomment and run to remove test data
   ============================================================ */
/*
DELETE d FROM bss_txn_approve_manual_key_in d
INNER JOIN bss_txn_approve_manual_key_in_tran t ON d.approve_manual_key_in_tran_id = t.approve_manual_key_in_tran_id
WHERE t.header_card_code IN ('0054309830', '0054941520');

DELETE FROM bss_txn_approve_manual_key_in_tran WHERE header_card_code IN ('0054309830', '0054941520');
DELETE FROM bss_txn_prepare WHERE header_card_code IN ('0054309830', '0054941520');
DELETE FROM bss_txn_container_prepare WHERE container_code LIKE 'MK-TEST%';
*/
