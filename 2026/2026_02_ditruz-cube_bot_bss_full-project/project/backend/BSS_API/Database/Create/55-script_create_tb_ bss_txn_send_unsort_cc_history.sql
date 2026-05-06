
CREATE TABLE bss_txn_send_unsort_cc_history (
    his_unsort_id BIGINT IDENTITY(1,1) NOT NULL,
    department_id INTEGER NOT NULL,
    send_unsort_code NVARCHAR(20) NOT NULL,
    ref_code NVARCHAR(10) NOT NULL,
    old_ref_code NVARCHAR(10) NULL,
    created_by INTEGER NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INTEGER NULL,
    updated_date DATETIME NULL,

    
    CONSTRAINT PK_bss_txn_send_unsort_cc_history PRIMARY KEY (his_unsort_id),
    CONSTRAINT FK_bss_txn_send_unsort_cc_history_department FOREIGN KEY (department_id) 
        REFERENCES bss_mst_bn_operation_center (department_id)
);