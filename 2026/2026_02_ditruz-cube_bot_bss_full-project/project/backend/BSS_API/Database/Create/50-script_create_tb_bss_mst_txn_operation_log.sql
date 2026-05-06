CREATE TABLE bss_txn_operation_log (
    operation_log_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    operation_page NVARCHAR(100) NOT NULL,
    operation_controller NVARCHAR(100) NOT NULL,
    operation_action NVARCHAR(100) NOT NULL,
    operation_param NVARCHAR(MAX) NOT NULL,
    operation_result NVARCHAR(30) NOT NULL,
    remark NVARCHAR(500) NULL, 
    created_by INT NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT NULL,
    updated_date DATETIME NULL
);