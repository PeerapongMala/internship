CREATE TABLE bss_mst_config_history (
    config_his_id INT IDENTITY(1,1) PRIMARY KEY,
    config_id INT NOT NULL,
    config_type_id INT NOT NULL,
    config_code NVARCHAR(50) NOT NULL,
    config_value NVARCHAR(300) NULL,
    is_holiday BIT NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    config_descript NVARCHAR(300) NULL,
    is_active BIT NULL,
    created_by INT NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT NULL,
    updated_date DATETIME NULL,
    
    -- Foreign Key ไปที่ bss_mst_config
    CONSTRAINT FK_bss_mst_config_history_config 
        FOREIGN KEY (config_id) 
        REFERENCES bss_mst_config(config_id),
    -- Foreign Key ไปที่ bss_mst_config_type
    CONSTRAINT FK_bss_mst_config_history_config_type 
        FOREIGN KEY (config_type_id) 
        REFERENCES bss_mst_config_type(config_type_id)
);
