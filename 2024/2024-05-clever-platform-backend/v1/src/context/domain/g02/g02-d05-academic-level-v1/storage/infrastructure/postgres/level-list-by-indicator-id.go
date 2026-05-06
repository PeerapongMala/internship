package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LevelListByIndicatorId(indicatorId int, subLessonIds []int) ([]constant.IndicatorLevelsEntity, error) {
	query := `
		SELECT
			l.id,
			l."level_type",
			l."difficulty"
		FROM
		    "curriculum_group"."indicator" i
		INNER JOIN
			"subject"."sub_lesson" sl ON "sl"."indicator_id" = "i"."id"
		INNER JOIN
			"level"."level" l ON "l"."sub_lesson_id" = "sl"."id"
		WHERE
		    "i"."id" = $1 

	`
	args := []interface{}{indicatorId}
	argsIndex := len(args) + 1

	if len(subLessonIds) != 0 {
		query += fmt.Sprintf(` AND "sl"."id" = ANY($%d)`, argsIndex)
		args = append(args, subLessonIds)
		argsIndex++
	}

	query += `
		ORDER BY 
		    "l"."id"
	`

	indicatorLevels := []constant.IndicatorLevelsEntity{}
	err := postgresRepository.Database.Select(&indicatorLevels, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return indicatorLevels, nil
}
