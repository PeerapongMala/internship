package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) CreateReportBug(tx *sqlx.Tx, bug *constant.Bug) (*int, error) {
	query := `
		INSERT INTO bug.bug_report
		(created_at, os, browser, type, platform, version, priority, url, description, status, created_by)
		VALUES
		($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id
	`

	args := []interface{}{bug.CreatedAt, bug.Os, bug.Browser, bug.Type, bug.Platform, bug.Version, bug.Priority, bug.Url, bug.Description, bug.Status, bug.CreatedBy}
	err := tx.QueryRowx(query, args...).Scan(&bug.BugID)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &bug.BugID, nil
}
