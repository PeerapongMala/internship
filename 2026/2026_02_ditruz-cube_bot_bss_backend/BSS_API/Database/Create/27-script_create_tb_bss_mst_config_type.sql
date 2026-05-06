CREATE TABLE bss_mst_config_type (
    config_type_id INT IDENTITY(1,1) PRIMARY KEY,      
    config_type_code NVARCHAR(10) NOT NULL UNIQUE,                   
    config_type_descrpt NVARCHAR(100),        
    is_active BIT,                                
    created_by INT,                              
    created_date DATETIME NOT NULL DEFAULT GETDATE(), 
    updated_by INT,                               
    updated_date DATETIME                         
);