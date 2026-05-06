DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT nspname
        FROM pg_catalog.pg_namespace
        WHERE nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast', 'pg_temp')
    )
    LOOP
        EXECUTE format('DROP SCHEMA %I CASCADE', r.nspname);
    END LOOP;
END $$;

create schema public;