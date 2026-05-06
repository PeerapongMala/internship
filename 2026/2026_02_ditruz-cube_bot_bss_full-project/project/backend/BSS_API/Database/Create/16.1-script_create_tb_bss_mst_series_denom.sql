CREATE TABLE bss_mst_series_denom (
    series_denom_id INT IDENTITY(1,1) PRIMARY KEY,
    series_code NVARCHAR(5) NOT NULL UNIQUE,
    series_descrpt NVARCHAR(50) NOT NULL,
    is_active BIT NULL,
    created_by INT NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT NULL,
    updated_date DATETIME NULL
);