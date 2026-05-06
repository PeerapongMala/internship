CREATE TABLE bss_txn_manual_history (
    manual_his_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    reconcile_id BIGINT NOT NULL,
    old_deno_price INTEGER NOT NULL,
    new_deno_price INTEGER NOT NULL,
    old_bn_type NVARCHAR(10) NOT NULL,
    new_bn_type NVARCHAR(10) NOT NULL,
    old_denom_series NVARCHAR(10) NOT NULL,
    new_denom_series NVARCHAR(10) NOT NULL,
    old_qty INTEGER NOT NULL,
    new_qty INTEGER NOT NULL,
    old_value INTEGER NOT NULL,
    new_value INTEGER NOT NULL,
    sup_action NVARCHAR(5) NOT NULL,
    manager_id INTEGER NULL,
    officer_id INTEGER NULL,
    is_manual_key BIT NULL,
    created_by INTEGER NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INTEGER NULL,
    updated_date DATETIME NULL,

    CONSTRAINT FK_reconcile_id_manual_history FOREIGN KEY (reconcile_id) REFERENCES bss_txn_reconcile(reconcile_id)
);