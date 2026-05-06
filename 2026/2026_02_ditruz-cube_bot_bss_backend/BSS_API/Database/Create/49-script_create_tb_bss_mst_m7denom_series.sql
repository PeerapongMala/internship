CREATE TABLE bss_mst_m7denom_series (
    m7denom_series_id INT PRIMARY KEY IDENTITY(1,1),
    m7_denom_id INT NOT NULL,
    series_denom_id INT NOT NULL,
    is_active BIT NULL,
    created_by INT NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT NULL,
    updated_date DATETIME NULL,
	
    CONSTRAINT FK_series_M7Denom FOREIGN KEY (m7_denom_id)
        REFERENCES bss_mst_m7_denom(m7_denom_id),

    CONSTRAINT FK_series_SeriesDenom FOREIGN KEY (series_denom_id)
        REFERENCES bss_mst_series_denom(series_denom_id)
);