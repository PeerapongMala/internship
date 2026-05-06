CREATE TABLE bss_txn_send_unsort_data_history (
    his_data_id BIGINT IDENTITY(1,1) NOT NULL,
    his_unsort_id BIGINT NOT NULL,
    register_unsort_id BIGINT NOT NULL,
    container_code NVARCHAR(10) NOT NULL,
    created_by INTEGER NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INTEGER NULL,
    updated_date DATETIME NULL,

    
    CONSTRAINT PK_bss_txn_send_unsort_data_history PRIMARY KEY (his_data_id),
    CONSTRAINT FK_bss_txn_send_unsort_data_history_main FOREIGN KEY (his_unsort_id) 
        REFERENCES bss_txn_send_unsort_cc_history (his_unsort_id),
    CONSTRAINT FK_bss_txn_send_unsort_data_history_register FOREIGN KEY (register_unsort_id) 
        REFERENCES bss_txn_register_unsort (register_unsort_id)
);