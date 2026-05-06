CREATE TABLE bss_mst_user (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    department_id INT NOT NULL,
    username NVARCHAR(40) NOT NULL UNIQUE,
    username_display NVARCHAR(100),
    id_no NVARCHAR(15),
    user_mail NVARCHAR(100) NOT NULL UNIQUE,
    first_name NVARCHAR(50) NOT NULL,
    last_name NVARCHAR(50),
    is_internal BIT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_active BIT,
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME,
    CONSTRAINT FK_bss_mst_user_department FOREIGN KEY (department_id) REFERENCES bss_mst_bn_operation_center(department_id)
);