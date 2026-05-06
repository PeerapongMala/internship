CREATE TABLE bss_txn_reconcile_tmp (
    reconcile_tmp_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    reconcile_tran_id BIGINT NOT NULL,
    bn_type NVARCHAR(10) NOT NULL,
    denom_series NVARCHAR(10) NOT NULL,
    deno_price INTEGER NOT NULL,
    tmp_qty INTEGER NOT NULL,
    tmp_value INTEGER NOT NULL,
    created_by INT,
    created_date DATETIME NOT NULL,
    updated_by INT,
    update_date DATETIME NOT NULL,
    
    CONSTRAINT FK_reconcile_tran_id FOREIGN KEY (reconcile_tran_id) REFERENCES bss_txn_reconcile_tran(reconcile_tran_id)
);