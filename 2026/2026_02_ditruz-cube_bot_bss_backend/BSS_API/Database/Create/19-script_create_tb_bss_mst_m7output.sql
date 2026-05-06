CREATE TABLE bss_mst_m7output (
    m7output_id INT IDENTITY(1,1) PRIMARY KEY,    
    m7output_code NVARCHAR(10) NOT NULL UNIQUE,  
    m7output_descrpt NVARCHAR(50),               
    is_active BIT,                                    
    created_by INT,                                   
    created_date DATETIME NOT NULL DEFAULT GETDATE(), 
    updated_by INT,                                   
    updated_date DATETIME                             
);