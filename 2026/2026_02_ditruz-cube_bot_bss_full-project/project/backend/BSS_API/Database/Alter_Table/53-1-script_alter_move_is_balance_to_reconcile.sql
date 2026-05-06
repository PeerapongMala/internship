-- Move is_balance from bss_txn_reconcile_tran (wrong) to bss_txn_reconcile (correct per Data Dict)

-- Step 1: Add is_balance to bss_txn_reconcile
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('bss_txn_reconcile') AND name = 'is_balance'
)
BEGIN
    ALTER TABLE bss_txn_reconcile ADD [is_balance] [bit] NULL DEFAULT ((0));
END
GO

-- Step 2: Drop is_balance from bss_txn_reconcile_tran
IF EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('bss_txn_reconcile_tran') AND name = 'is_balance'
)
BEGIN
    DECLARE @ConstraintName NVARCHAR(256);
    SELECT @ConstraintName = dc.name
    FROM sys.default_constraints dc
    JOIN sys.columns c ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
    WHERE dc.parent_object_id = OBJECT_ID('bss_txn_reconcile_tran') AND c.name = 'is_balance';

    IF @ConstraintName IS NOT NULL
        EXEC('ALTER TABLE bss_txn_reconcile_tran DROP CONSTRAINT ' + @ConstraintName);

    ALTER TABLE bss_txn_reconcile_tran DROP COLUMN [is_balance];
END
GO
