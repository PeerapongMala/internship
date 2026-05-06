-- Create table: bss_txn_approve_manual_key_in
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'bss_txn_approve_manual_key_in')
BEGIN
    CREATE TABLE [dbo].[bss_txn_approve_manual_key_in] (
        [approve_manual_key_in_id] BIGINT IDENTITY(1,1) NOT NULL,
        [approve_manual_key_in_tran_id] BIGINT NOT NULL,
        [bn_type] NVARCHAR(50) NULL,
        [denom_series] NVARCHAR(100) NULL,
        [qty] INT NOT NULL DEFAULT 0,
        [total_value] INT NOT NULL DEFAULT 0,
        [is_replace_t] BIT NULL,
        [is_replace_c] BIT NULL,
        [adjust_type] NVARCHAR(50) NULL,
        [is_normal] BIT NULL,
        [is_addon] BIT NULL,
        [is_endjam] BIT NULL,
        [adjust_date] DATETIME NULL,
        [manual_by] INT NULL,
        [manual_date] DATETIME NULL,
        [verify_by] INT NULL,
        [verify_date] DATETIME NULL,
        [is_send_cbms] BIT NULL,
        [is_active] BIT NULL,
        [created_by] INT NOT NULL,
        [created_date] DATETIME NOT NULL DEFAULT GETDATE(),
        [updated_by] INT NULL,
        [updated_date] DATETIME NULL,
        CONSTRAINT [PK_bss_txn_approve_manual_key_in] PRIMARY KEY CLUSTERED ([approve_manual_key_in_id] ASC)
    );

    -- Foreign key to tran table
    ALTER TABLE [dbo].[bss_txn_approve_manual_key_in]
        ADD CONSTRAINT [FK_approve_mki_tran_id] FOREIGN KEY ([approve_manual_key_in_tran_id])
        REFERENCES [dbo].[bss_txn_approve_manual_key_in_tran] ([approve_manual_key_in_tran_id]);

    PRINT 'Table bss_txn_approve_manual_key_in created successfully.';
END
ELSE
BEGIN
    PRINT 'Table bss_txn_approve_manual_key_in already exists.';
END
GO
