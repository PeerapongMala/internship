CREATE TABLE bss_txn_machine_hd (
    machine_hd_id BIGINT PRIMARY KEY IDENTITY(1,1), 
    source_file_id BIGINT,
    department_id NVARCHAR(15) NOT NULL,
    machine_id INT,
	header_card_code NVARCHAR(15) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    deposit_id NVARCHAR(15),
    is_reject NVARCHAR(5), 
    is_active BIT, 
    seq_no INT,
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME,

    CONSTRAINT FK_txn_machine_hd_source_file FOREIGN KEY (source_file_id) REFERENCES bss_txn_source_file(source_file_id),
	CONSTRAINT FK_department FOREIGN KEY (department_id) REFERENCES bss_mst_bn_operation_center(department_id),
	CONSTRAINT FK_machine FOREIGN KEY (machine_id) REFERENCES bss_mst_machine (machine_id)

);