package postgres

import (
	"database/sql"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d06-bug-report-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UpdateBugStatus(tx *sqlx.Tx, bugLog *constant.BugLog) error {
	type QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.Exec
		}
		return postgresRepository.Database.Exec
	}()

	updateQuery := `
		UPDATE bug.bug_report
		SET status = $1
		WHERE id = $2;
	`

	agrs := []interface{}{bugLog.Status, bugLog.BugID}
	_, err := queryMethod(updateQuery, agrs...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	insertQuery := `
		INSERT INTO "bug"."bug_report_status_log" (
			"bug_report_id",
			"status",
			"message",
			"created_at",
			"created_by"
		)
		VALUES ($1, $2, $3, $4, $5);
	`

	agrs = []interface{}{bugLog.BugID, bugLog.Status, bugLog.Message, bugLog.CreatedAt, bugLog.CreatedBy}
	_, err = queryMethod(insertQuery, agrs...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
