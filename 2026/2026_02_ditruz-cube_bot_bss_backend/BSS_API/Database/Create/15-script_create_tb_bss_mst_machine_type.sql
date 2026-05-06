CREATE TABLE bss_mst_machine_type (
    machine_type_id INT IDENTITY(1,1) PRIMARY KEY, 
    machine_type_code NVARCHAR(10) NOT NULL UNIQUE, 
    machine_type_name NVARCHAR(20) NOT NULL,       
    is_active BIT,                                 
    created_by INT,                                
    created_date DATETIME NOT NULL DEFAULT GETDATE(), 
    updated_by INT,                                
    updated_date DATETIME                          
);