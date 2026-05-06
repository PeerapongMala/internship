-- Add Column bntype_code Table bss_mst_bn_type
Alter Table bss_mst_bn_type
Add bntype_code nvarchar(3) not null,

-- Add Column bss_bntype_code
Alter Table bss_mst_bn_type
Add bss_bntype_code nvarchar(3) not null;