CREATE TABLE bss_mst_status (
    status_id INT IDENTITY(1,1) PRIMARY KEY,
    status_code NVARCHAR(10) UNIQUE NOT NULL,
    status_name_th NVARCHAR(50) NOT NULL,
    status_name_en NVARCHAR(30) NOT NULL,
    is_active BIT,
    created_by INT,
    created_date DATETIME DEFAULT GETDATE(), 
    updated_by INT,
    updated_date DATETIME
);