CREATE TABLE bss_mst_bn_operation_center (
    department_id INT PRIMARY KEY IDENTITY(1,1) ,
    department_code NVARCHAR(20) NOT NULL,
    dept_short_name NVARCHAR(20) NOT NULL,
    department_name NVARCHAR(100) NOT NULL,
    is_active BIT,
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME
    );