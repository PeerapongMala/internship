package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) CurriculumGroupList(pagination *helper.Pagination, userId string) ([]constant.CurriculumGroupEntity, error) {
	query := `
		WITH distinct_curriculum_groups AS ( 
			SELECT 
				DISTINCT "cg"."id", 
				"cg"."name", 
				"cg"."short_name" 
			FROM "level"."level_play_log" lpl 
			INNER JOIN "level"."level" l ON "lpl"."level_id" = "l"."id" 
			INNER JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id" 
			INNER JOIN "subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id" 
			INNER JOIN "subject"."subject" s ON "ls"."subject_id" = "s"."id" 
			INNER JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id" 
			INNER JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id" 
			INNER JOIN "curriculum_group"."platform" p ON "y"."platform_id" = "p"."id" 
			INNER JOIN "curriculum_group"."curriculum_group" cg ON "p"."curriculum_group_id" = "cg"."id" 
			WHERE "lpl"."student_id" = $1 
			AND "cg"."id" IS NOT NULL 
		) 
		SELECT 
			*, 
			(SELECT COUNT(*) FROM distinct_curriculum_groups) AS total_count 
		FROM distinct_curriculum_groups 
	`
	args := []interface{}{userId}
	argsIndex := len(args) + 1

	if pagination != nil {
		query += fmt.Sprintf(` ORDER BY id OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	curriculumGroupEntities := []constant.CurriculumGroupEntity{}
	err := postgresRepository.Database.Select(&curriculumGroupEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if len(curriculumGroupEntities) > 0 {
		helper.DerefPagination(pagination).TotalCount = curriculumGroupEntities[0].TotalCount
	}

	return curriculumGroupEntities, nil
}
