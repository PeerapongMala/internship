CREATE TABLE bss_mst_m7_quality (
    m7_quality_id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    m7_quality_code NVARCHAR(15) NOT NULL,
    m7_quality_descrpt NVARCHAR(50),
    m7_quality_cps NVARCHAR(15),
    is_active BIT,
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME
);