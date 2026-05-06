CREATE TABLE bss_txn_manual_tmp (
    manual_tmp_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    reconcile_tran_id BIGINT NOT NULL,
    reconcile_id BIGINT,
    deno_price INTEGER NOT NULL,
    bn_type NVARCHAR(10) NOT NULL,
    denom_series NVARCHAR(10) NOT NULL,
    tmp_qty INTEGER NOT NULL,
    tmp_value INTEGER NOT NULL,
    tmp_action NVARCHAR(5) NOT NULL,
    manual_date DATETIME NOT NULL,
    
    CONSTRAINT FK_reconcile_tran_id_manual FOREIGN KEY (reconcile_tran_id) REFERENCES bss_txn_reconcile_tran(reconcile_tran_id),
    CONSTRAINT FK_reconcile_id_manual FOREIGN KEY (reconcile_id) REFERENCES bss_txn_reconcile(reconcile_id)
);