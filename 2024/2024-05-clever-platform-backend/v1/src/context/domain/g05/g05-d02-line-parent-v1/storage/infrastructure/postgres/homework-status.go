package postgres

import (
	"database/sql"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetHomeworkStatus(homeworkID int, userID string, classID int) (*constant.HomeworkPlayCount, error) {
	query := `
		SELECT 
			s.user_id AS user_id,
			count(DISTINCT lpl.level_id) AS level_play_count,
			max(lpl.played_at) AS max_played_at
		FROM "level".level_play_log lpl
		LEFT JOIN homework.homework h 
			ON h.id = lpl.homework_id
		LEFT JOIN homework.homework_template ht 
			ON ht.id = h.homework_template_id
		FULL JOIN "user".student s 
			ON s.user_id = lpl.student_id
		LEFT JOIN "user"."user" u 
			ON u.id = s.user_id
		WHERE 
			lpl.homework_id = $1
			AND s.user_id = $2
			AND lpl.class_id = $3
		GROUP BY s.user_id
	`

	args := []interface{}{homeworkID, userID, classID}
	homeworkPlayCount := constant.HomeworkPlayCount{}
	err := postgresRepository.Database.QueryRowx(query, args...).StructScan(&homeworkPlayCount)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// No result found: return nil instead of error
			return nil, nil
		}
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &homeworkPlayCount, nil
}
