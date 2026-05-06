CREATE TABLE bss_mst_bn_type (
    bntype_id INT IDENTITY(1,1) PRIMARY KEY,
    bntype_name NVARCHAR(30) NOT NULL UNIQUE,
    bntype_descrpt NVARCHAR(50),
    is_display BIT,
    is_active BIT,
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME
);