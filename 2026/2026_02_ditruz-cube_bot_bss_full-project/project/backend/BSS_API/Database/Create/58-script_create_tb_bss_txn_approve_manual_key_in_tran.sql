-- Create table: bss_txn_approve_manual_key_in_tran
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'bss_txn_approve_manual_key_in_tran')
BEGIN
    CREATE TABLE [dbo].[bss_txn_approve_manual_key_in_tran] (
        [approve_manual_key_in_tran_id] BIGINT IDENTITY(1,1) NOT NULL,
        [department_id] INT NOT NULL,
        [prepare_id] BIGINT NOT NULL,
        [machine_hd_id] INT NOT NULL,
        [header_card_code] NVARCHAR(100) NULL,
        [header_parent_id] BIGINT NULL,
        [m7_qty] INT NULL,
        [manual_key_in_qty] INT NULL,
        [sup_qty] INT NULL,
        [bundle_num] INT NULL,
        [total_value] INT NULL,
        [status_id] INT NOT NULL,
        [approve_by] INT NULL,
        [approve_date] DATETIME NULL,
        [reference_code] NVARCHAR(200) NULL,
        [sorter_id] INT NULL,
        [shift_id] INT NOT NULL DEFAULT 0,
        [remark] NVARCHAR(500) NULL,
        [alert_remark] NVARCHAR(500) NULL,
        [is_display] BIT NULL,
        [is_active] BIT NULL,
        [is_revoke] BIT NULL,
        [count_manual_key_in] INT NULL,
        [is_warning] BIT NULL,
        [is_not_approved] BIT NULL,
        [created_by] INT NOT NULL,
        [created_date] DATETIME NOT NULL DEFAULT GETDATE(),
        [updated_by] INT NULL,
        [updated_date] DATETIME NULL,
        CONSTRAINT [PK_bss_txn_approve_manual_key_in_tran] PRIMARY KEY CLUSTERED ([approve_manual_key_in_tran_id] ASC)
    );

    -- Foreign keys
    ALTER TABLE [dbo].[bss_txn_approve_manual_key_in_tran]
        ADD CONSTRAINT [FK_approve_mki_tran_department] FOREIGN KEY ([department_id])
        REFERENCES [dbo].[bss_mst_company_department] ([department_id]);

    ALTER TABLE [dbo].[bss_txn_approve_manual_key_in_tran]
        ADD CONSTRAINT [FK_approve_mki_tran_prepare] FOREIGN KEY ([prepare_id])
        REFERENCES [dbo].[bss_txn_prepare] ([prepare_id]);

    ALTER TABLE [dbo].[bss_txn_approve_manual_key_in_tran]
        ADD CONSTRAINT [FK_approve_mki_tran_status] FOREIGN KEY ([status_id])
        REFERENCES [dbo].[bss_mst_status] ([status_id]);

    PRINT 'Table bss_txn_approve_manual_key_in_tran created successfully.';
END
ELSE
BEGIN
    PRINT 'Table bss_txn_approve_manual_key_in_tran already exists.';
END
GO
