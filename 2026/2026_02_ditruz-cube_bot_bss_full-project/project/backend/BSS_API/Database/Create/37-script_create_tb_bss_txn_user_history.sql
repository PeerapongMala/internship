CREATE TABLE bss_txn_user_history (
    user_his_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    department_id INT NOT NULL,
    role_group_id INT NOT NULL,
    username NVARCHAR(40) NOT NULL,
    user_mail NVARCHAR(100),
    first_name NVARCHAR(50) NOT NULL,
    last_name NVARCHAR(50),
    is_internal BIT,
    start_date DATETIME,
    end_date DATETIME,
    user_created_date DATETIME,
    created_by INT,
    created_date DATETIME,
    updated_by INT,
    updated_date DATETIME,
    
    CONSTRAINT FK_bss_txn_user_history_department FOREIGN KEY (department_id) 
    REFERENCES bss_mst_bn_operation_center(department_id),
    CONSTRAINT FK_bss_txn_user_history_role_group FOREIGN KEY (role_group_id) 
    REFERENCES bss_mst_role_group (role_group_id)

);