CREATE TABLE bss_mst_role (
    role_id INT PRIMARY KEY IDENTITY(1,1), 
    role_group_id INT NOT NULL,
    role_code NVARCHAR(10) NOT NULL UNIQUE,
    role_name NVARCHAR(50) NULL,
    role_descript NVARCHAR(100) NULL,
    seq_no INT NULL DEFAULT 0,
    is_get_otp_sup BIT NULL DEFAULT 0, 
    is_get_otp_man BIT NULL DEFAULT 0, 
    is_active BIT NULL, 
    created_by INT NULL, 
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT NULL, 
    updated_date DATETIME NULL,
	
	CONSTRAINT FK_bss_mst_role_group FOREIGN KEY (role_group_id)
    REFERENCES bss_mst_role_group (role_group_id)
);
