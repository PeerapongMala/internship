package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ReportBugImageCreate(tx *sqlx.Tx, bugId int, imageUrls []string) error {
	query := `
		INSERT INTO bug.bug_report_image
		(bug_report_id, image_url)
		VALUES
		($1, $2)
	`
	for _, url := range imageUrls {
		_, err := tx.Exec(query, bugId, url)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
