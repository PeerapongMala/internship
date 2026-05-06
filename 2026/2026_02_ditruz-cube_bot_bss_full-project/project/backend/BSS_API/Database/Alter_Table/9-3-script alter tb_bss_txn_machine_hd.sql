-- Modify Column remark from nvarchar(300) to nvarchar(MAX)
ALTER TABLE bss_txn_machine_hd
ALTER COLUMN remark nvarchar(MAX);
