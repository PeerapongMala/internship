CREATE TABLE bss_txn_register_unsort (
    register_unsort_id BIGINT PRIMARY KEY IDENTITY(1,1), -- เพิ่ม IDENTITY(1,1)
    container_code NVARCHAR(10) NOT NULL,
    department_id INT NOT NULL,
    is_active BIT,
    status_id INT NOT NULL,
    supervisor_received INT,
    received_date DATETIME,
    remark NVARCHAR(300),
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME,
    CONSTRAINT FK_register_unsort_dept FOREIGN KEY (department_id) REFERENCES bss_mst_bn_operation_center(department_id),
    CONSTRAINT FK_register_unsort_status FOREIGN KEY (status_id) REFERENCES bss_mst_status(status_id)
);