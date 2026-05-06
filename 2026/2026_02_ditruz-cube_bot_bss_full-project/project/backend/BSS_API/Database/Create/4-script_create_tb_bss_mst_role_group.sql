CREATE TABLE bss_mst_role_group (
    role_group_id INT PRIMARY KEY IDENTITY(1,1) , 
    role_group_code NVARCHAR(10) NOT NULL UNIQUE,
    role_group_name NVARCHAR(50) NOT NULL,
    is_active BIT NULL, 
    created_by INT NULL, 
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT NULL, 
    updated_date DATETIME NULL
       
);
