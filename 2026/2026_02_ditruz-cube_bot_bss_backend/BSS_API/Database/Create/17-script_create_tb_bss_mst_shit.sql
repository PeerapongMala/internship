CREATE TABLE bss_mst_shift (
    shift_id INT IDENTITY(1,1) PRIMARY KEY,    -- รหัสรายการของผลัดการทำงาน (PK, Auto Increment)
    shift_code NVARCHAR(10) NOT NULL UNIQUE,  
    shift_name NVARCHAR(20),                  
    start_time NVARCHAR(10) NOT NULL,         
    end_time NVARCHAR(10) NOT NULL,           
    is_active BIT,                            
    created_by INT,                           
    created_date DATETIME NOT NULL DEFAULT GETDATE(), 
    updated_by INT,                           
    updated_date DATETIME                    
);