CREATE TABLE bss_txn_unsort_cc_history (
    his_cc_id BIGINT IDENTITY(1,1) NOT NULL,
    his_data_id BIGINT NOT NULL,
    inst_id INTEGER NOT NULL,
    deno_id INTEGER NOT NULL,
    banknote_qty INTEGER NOT NULL,
    remaining_qty INTEGER NOT NULL,
    created_by INTEGER NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INTEGER NULL,
    updated_date DATETIME NULL,
    CONSTRAINT PK_bss_txn_unsort_cc_history PRIMARY KEY (his_cc_id),
    CONSTRAINT FK_bss_txn_unsort_cc_history_data FOREIGN KEY (his_data_id) 
        REFERENCES bss_txn_send_unsort_data_history (his_data_id),
    CONSTRAINT FK_bss_txn_unsort_cc_history_inst FOREIGN KEY (inst_id) 
        REFERENCES bss_mst_institution (inst_id),
    CONSTRAINT FK_bss_txn_unsort_cc_history_deno FOREIGN KEY (deno_id) 
        REFERENCES bss_mst_denomination (deno_id)
);