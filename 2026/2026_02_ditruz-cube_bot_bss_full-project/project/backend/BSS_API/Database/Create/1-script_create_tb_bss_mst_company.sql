CREATE TABLE bss_mst_company(
    company_id INT PRIMARY KEY IDENTITY(1,1) ,
    company_code NVARCHAR(10) NOT NULL UNIQUE,
    company_name NVARCHAR(100) NOT NULL,
    is_active BIT,
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME
    
);