CREATE TABLE bss_txn_application_log (
    app_log_id BIGINT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    app_controller NVARCHAR(100) NOT NULL,
    app_action NVARCHAR(100) NOT NULL,
    app_param NVARCHAR(MAX) NOT NULL,
    app_result NVARCHAR(MAX) NOT NULL,
    remark NVARCHAR(500) NULL, 
    created_by INT NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT NULL,
    updated_date DATETIME NULL
);