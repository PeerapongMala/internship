CREATE TABLE bss_txn_notification (
    notification_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    notification_type_code VARCHAR(255) NOT NULL,
    department_id INTEGER NOT NULL,
    message NVARCHAR(255) NOT NULL,
    is_sent BIT,
    created_by INTEGER,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INTEGER,
    updated_date DATETIME,
    CONSTRAINT FK_Notification_Department FOREIGN KEY (department_id) REFERENCES bss_mst_bn_operation_center(department_id)
);