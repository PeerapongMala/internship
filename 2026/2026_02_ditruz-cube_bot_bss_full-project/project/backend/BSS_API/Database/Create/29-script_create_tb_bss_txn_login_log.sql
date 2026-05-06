CREATE TABLE bss_txn_login_log (
    login_log_id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    department_id INT NOT NULL,
    user_id INT NOT NULL,
    machine_id INT,
    first_login DATETIME,
    last_login DATETIME,
    remark NVARCHAR(100),
    is_active BIT,
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME,
    CONSTRAINT FK_bss_txn_login_log_department FOREIGN KEY (department_id)
        REFERENCES bss_mst_bn_operation_center (department_id),
    CONSTRAINT FK_bss_txn_login_log_machine FOREIGN KEY (machine_id)
        REFERENCES bss_mst_machine (machine_id),
    CONSTRAINT FK_bss_txn_login_log_user FOREIGN KEY (user_id)
        REFERENCES bss_mst_user (user_id)
);