package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d06-bug-report-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) BugLogList(bugID int) ([]*constant.BugLog, error) {
	query := `
		SELECT 
			bl.id,
			bl.bug_report_id AS bug_id,
			bl.status,
			bl.message,
			bl.created_at,
			u.first_name AS "created_by"
		FROM bug.bug_report b
		JOIN bug.bug_report_status_log bl
			ON b.id = bl.bug_report_id
		JOIN "user"."user" u
			ON "bl"."created_by" = "u"."id"
		WHERE bl.bug_report_id = $1
		ORDER BY bl.created_at DESC
	`

	args := []interface{}{bugID}
	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	var bugs []*constant.BugLog
	for rows.Next() {
		bug := constant.BugLog{}
		err := rows.StructScan(&bug)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		bugs = append(bugs, &bug)
	}
	return bugs, nil
}
