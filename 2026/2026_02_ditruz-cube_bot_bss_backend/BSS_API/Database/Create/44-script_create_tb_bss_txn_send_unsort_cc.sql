CREATE TABLE bss_txn_send_unsort_cc(
    send_unsort_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    department_id INT NOT NULL,
    send_unsort_code NVARCHAR(20) NOT NULL,
    remark NVARCHAR(200) NULL,
    ref_code NVARCHAR(10) NOT NULL,
    old_ref_code NVARCHAR(10) NULL,
    status_id INT NOT NULL,
    is_active BIT NULL,
    created_by INT NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT NULL,
    updated_date DATETIME NULL,
	
	CONSTRAINT FK_bss_txn_send_unsort_cc_department FOREIGN KEY(department_id)
    REFERENCES bss_mst_bn_operation_center (department_id),
	CONSTRAINT FK_bss_txn_send_unsort_cc_status FOREIGN KEY(status_id)
    REFERENCES bss_mst_status (status_id)
   
);
