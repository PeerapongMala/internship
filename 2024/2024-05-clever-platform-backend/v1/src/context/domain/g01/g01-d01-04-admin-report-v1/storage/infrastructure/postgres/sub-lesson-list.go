package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubLessonList(pagination *helper.Pagination, filter *constant.SubLessonFilter) ([]constant.SubLessonEntity, error) {
	query := `
		WITH distinct_sub_lessons AS ( 
			SELECT DISTINCT ON ("sl"."id")
				"sl"."id",
				"sl"."name"
			FROM "level"."level_play_log" lpl
			LEFT JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
			LEFT JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
			LEFT JOIN "subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
			WHERE 
				"lpl"."student_id" = $1
				AND "ls"."id" = $2
	`
	args := []interface{}{filter.UserId, filter.LessonId}
	argsIndex := len(args) + 1

	if filter.SubLessonId != 0 {
		query += fmt.Sprintf(` AND "sl"."id" = $%d`, argsIndex)
		args = append(args, filter.SubLessonId)
		argsIndex++
	}

	query += `
		) 
		SELECT 
			*, 
			(SELECT COUNT(*) FROM distinct_sub_lessons) AS total_count 
		FROM distinct_sub_lessons 	
	`

	if pagination != nil {
		query += fmt.Sprintf(` ORDER BY "id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	subLessonEntities := []constant.SubLessonEntity{}
	err := postgresRepository.Database.Select(&subLessonEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if len(subLessonEntities) > 0 {
		helper.DerefPagination(pagination).TotalCount = subLessonEntities[0].TotalCount
	}

	return subLessonEntities, nil
}
