package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) HelperCaseClearDatabaseData(tx *sqlx.Tx) error {
	query := `
		DO
		$$
		DECLARE
			table_name TEXT;
			schema_name TEXT;
		BEGIN
			FOR table_name, schema_name IN
				SELECT tablename, schemaname
				FROM pg_tables
				WHERE schemaname NOT IN ('pg_catalog', 'information_schema', 'public')
			LOOP
				EXECUTE FORMAT('TRUNCATE TABLE %I.%I RESTART IDENTITY CASCADE;', schema_name, table_name);
			END LOOP;
		END;
		$$;
	`
	_, err := tx.Exec(query)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
