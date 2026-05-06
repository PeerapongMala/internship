package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetReportBug(bugID int) (*constant.Bug, error) {
	query := `
		SELECT
			DISTINCT ON (br.id)
			br.id as bug_id,
			br.os,
			br.browser,
			br."type",
			br.platform,
			br.version,
			br.priority,
			br.url,
			br.description,
			br.status,
			br.created_at,
			br.created_by,
			u.first_name as creater_first_name,
			u.last_name as creater_last_name,
            r.name as role,
			bs.created_at as edited_at,
			bs.created_by as edited_by,
			us.first_name as editer_first_name,
			us.last_name as editer_last_name
		FROM bug.bug_report br
		LEFT JOIN bug.bug_report_status_log bs
			ON br.id = bs.bug_report_id
		INNER JOIN "user"."user" u
			ON br.created_by = u.id
		LEFT JOIN "user"."user" us
			ON bs.created_by = us.id
        INNER JOIN "user".user_role ur
        	ON u.id = ur.user_id
        INNER JOIN "user".role r
        	ON r.id = ur.role_id
		WHERE br.id = $1
		ORDER BY br.id DESC, bs.created_at DESC
	`

	args := []interface{}{bugID}
	bug := constant.Bug{}
	err := postgresRepository.Database.QueryRowx(query, args...).StructScan(&bug)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	image_query := `
		SELECT
			bri.image_url
		FROM bug.bug_report_image bri
		WHERE bri.bug_report_id = $1
	`

	var images []*string
	err = postgresRepository.Database.Select(&images, image_query, bug.BugID)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	bug.ImageUrls = images

	return &bug, nil
}
