-- Modify Column Table bss_mst_config_type
ALTER TABLE bss_mst_config_type
ALTER COLUMN config_type_code nvarchar(50) not null;

ALTER TABLE bss_mst_config_type
ALTER COLUMN config_type_descrpt nvarchar(300) null;