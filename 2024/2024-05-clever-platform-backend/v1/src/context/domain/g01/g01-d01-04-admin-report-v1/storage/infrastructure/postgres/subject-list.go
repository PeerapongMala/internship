package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubjectList(pagination *helper.Pagination, filter *constant.SubjectFilter) ([]constant.SubjectEntity, error) {
	query := `
		WITH distinct_subjects AS ( 
			SELECT DISTINCT ON ("s"."id")
				"s"."id",
				"s"."name"
			FROM "level"."level_play_log" lpl LEFT JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
			LEFT JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
			LEFT JOIN "subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
			LEFT JOIN "subject"."subject" s ON "ls"."subject_id" = "s"."id"
			LEFT JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
			LEFT JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
			LEFT JOIN "curriculum_group"."platform" p ON "y"."platform_id" = "p"."id"
			LEFT JOIN "curriculum_group"."curriculum_group" cg ON "p"."curriculum_group_id" = "cg"."id"
			WHERE 
				"lpl"."student_id" = $1
		
	`
	args := []interface{}{filter.UserId}
	argsIndex := len(args) + 1

	if filter.CurriculumGroupId != 0 {
		query += fmt.Sprintf(` AND "cg"."id" = $%d`, argsIndex)
		args = append(args, filter.CurriculumGroupId)
		argsIndex++
	}

	query += `
		) 
		SELECT 
			*, 
			(SELECT COUNT(*) FROM distinct_subjects) AS total_count 
		FROM distinct_subjects 
	`

	if pagination != nil {
		query += fmt.Sprintf(` ORDER BY "id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	subjectEntities := []constant.SubjectEntity{}
	err := postgresRepository.Database.Select(&subjectEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if len(subjectEntities) > 0 {
		helper.DerefPagination(pagination).TotalCount = subjectEntities[0].TotalCount
	}

	return subjectEntities, nil
}
