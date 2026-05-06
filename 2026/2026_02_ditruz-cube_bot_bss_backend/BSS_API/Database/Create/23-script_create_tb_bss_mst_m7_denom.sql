CREATE TABLE bss_mst_m7_denom (
    m7_denom_id INT IDENTITY(1,1) PRIMARY KEY,
    deno_id INT NOT NULL,
    m7_denom_code NVARCHAR(10) NOT NULL,
    m7_denom_name NVARCHAR(20) NOT NULL,
    m7_denom_descrpt NVARCHAR(30) NOT NULL,
    m7_denom_bms NVARCHAR(10),
    m7_dn_bms NVARCHAR(10),
    is_active BIT,
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME,
    CONSTRAINT FK_m7_denom_denomination FOREIGN KEY (deno_id)
        REFERENCES bss_mst_denomination (deno_id),
    CONSTRAINT UQ_m7denom_deno_id_denom_code_denom_name UNIQUE (deno_id,m7_denom_code,m7_denom_name)

);