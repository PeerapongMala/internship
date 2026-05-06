CREATE TABLE bss_mst_config (
    config_id INT PRIMARY KEY IDENTITY(1,1),
    config_type_id INT NOT NULL,
    config_code NVARCHAR(10) NOT NULL UNIQUE,
    config_value NVARCHAR(300),
    config_descript NVARCHAR(100),
    is_active BIT,
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME,

    -- Foreign Key Constraint
    CONSTRAINT FK_bss_mst_config_config_type_id FOREIGN KEY (config_type_id)
        REFERENCES bss_mst_config_type(config_type_id)
);