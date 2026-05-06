package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"

	"github.com/jackc/pgx/pgtype"
)

func (postgresRepository *postgresRepository) GetPassLevelIndexByUserIdAndHomeworkId(userId string, homeworkId int) (map[int][]int, error) {
	query := `
		SELECT
			"hs".index,
			ARRAY_AGG(DISTINCT lpl.level_id) AS level_ids
		FROM level.level_play_log lpl
		LEFT JOIN homework.homework_submission hs ON hs.level_play_log_id = lpl.id
		WHERE
			lpl.student_id = $1
			AND "hs"."index" IS NOT NULL
			AND lpl.homework_id = $2
		GROUP BY "hs".index
		ORDER BY SUM(lpl.star) DESC, "hs".index DESC
		LIMIT 1
	`

	rows, err := postgresRepository.Database.Queryx(query, userId, homeworkId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	mapIndexLevelIds := map[int][]int{}
	for rows.Next() {
		var index *int
		var levelIds pgtype.Int4Array
		err := rows.Scan(&index, &levelIds)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		mapIndexLevelIds[helper.Deref(index)] = helper.ConvertPgtypeInt4ToInt(levelIds)
	}

	return mapIndexLevelIds, nil
}
