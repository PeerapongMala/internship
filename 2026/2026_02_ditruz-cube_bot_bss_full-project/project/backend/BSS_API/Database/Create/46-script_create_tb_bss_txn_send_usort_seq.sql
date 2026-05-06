CREATE TABLE bss_mst_send_unsort_seq (
    send_seq_id INT PRIMARY KEY IDENTITY(1,1),
    department_id INT NOT NULL,
    send_seq_no INT NOT NULL,
    is_active BIT,
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME,
    CONSTRAINT FK_bss_mst_send_unsort_seq_department_id FOREIGN KEY (department_id) REFERENCES bss_mst_bn_operation_center(department_id)
);