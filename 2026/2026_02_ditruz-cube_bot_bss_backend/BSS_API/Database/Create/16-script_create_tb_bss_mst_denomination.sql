CREATE TABLE bss_mst_denomination (
    deno_id INTEGER IDENTITY(1,1) PRIMARY KEY,
    deno_code INTEGER UNIQUE NOT NULL,
    deno_price INTEGER NOT NULL,
    deno_descrpt NVARCHAR(20),
    deno_currency NVARCHAR(10) NOT NULL,
    is_active BIT,
    created_by INTEGER,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INTEGER,
    updated_date DATETIME
);