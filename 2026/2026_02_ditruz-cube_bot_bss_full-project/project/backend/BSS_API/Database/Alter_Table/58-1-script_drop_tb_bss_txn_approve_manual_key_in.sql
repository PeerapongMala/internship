-- Manual Key-In Refactor: DROP unused tables + ALTER existing tables
-- Reason: Refactored to use bss_txn_reconcile_tran, bss_txn_manual_tmp, bss_txn_manual_history
-- Date: 2026-03-12

-- ============================================================
-- Step 1: DROP detail table first (has FK to tran table)
-- ============================================================
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'bss_txn_approve_manual_key_in')
BEGIN
    DROP TABLE [dbo].[bss_txn_approve_manual_key_in];
    PRINT 'Table bss_txn_approve_manual_key_in dropped successfully.';
END
ELSE
BEGIN
    PRINT 'Table bss_txn_approve_manual_key_in does not exist, skipping.';
END
GO

-- ============================================================
-- Step 2: DROP tran table
-- ============================================================
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'bss_txn_approve_manual_key_in_tran')
BEGIN
    DROP TABLE [dbo].[bss_txn_approve_manual_key_in_tran];
    PRINT 'Table bss_txn_approve_manual_key_in_tran dropped successfully.';
END
ELSE
BEGIN
    PRINT 'Table bss_txn_approve_manual_key_in_tran does not exist, skipping.';
END
GO

-- ============================================================
-- Step 3: ALTER bss_txn_reconcile_tran — DROP columns ที่ไม่มีใน Excel Data Dict
-- ============================================================
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('bss_txn_reconcile_tran') AND name = 'manual_key_in_qty')
BEGIN
    ALTER TABLE [dbo].[bss_txn_reconcile_tran] DROP COLUMN [manual_key_in_qty];
    PRINT 'Column manual_key_in_qty dropped from bss_txn_reconcile_tran.';
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('bss_txn_reconcile_tran') AND name = 'count_manual_key_in')
BEGIN
    ALTER TABLE [dbo].[bss_txn_reconcile_tran] DROP COLUMN [count_manual_key_in];
    PRINT 'Column count_manual_key_in dropped from bss_txn_reconcile_tran.';
END
GO

-- Note: Step 4 (ADD is_balance to bss_txn_reconcile) removed
-- Already covered by 53-1-script_alter_move_is_balance_to_reconcile.sql
