package postgres

import (
	"database/sql"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d06-bug-report-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) BugGet(bugID int) (*constant.Bug, error) {
	query := `
		SELECT 
			b.id,
			b.created_at,
			b.platform,
			b.type,
			b.description,
			b.version,
			b.browser,
			b.os,
			b.url,
			"u"."first_name" AS "created_by",
			"b"."created_by" AS "creator_id",
			r.name AS role,
			b.priority,
			b.status
		FROM bug.bug_report b
		LEFT JOIN "user".user_role ur
			ON b.created_by = ur.user_id
		LEFT JOIN "user".role r
			ON ur.role_id = r.id
		LEFT JOIN "user"."user" u
			ON "b"."created_by" = "u"."id"
		WHERE b.id = $1
	`

	args := []interface{}{bugID}
	bug := constant.Bug{}
	err := postgresRepository.Database.QueryRowx(query, args...).StructScan(&bug)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &bug, nil
}
