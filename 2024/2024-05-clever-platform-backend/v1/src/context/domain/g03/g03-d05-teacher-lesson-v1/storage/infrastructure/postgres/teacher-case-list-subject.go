package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) TeacherCaseListSubject(teacherId string, classId int, filter constant.SubjectFilter, pagination *helper.Pagination, isParent bool) ([]constant.SubjectEntity, error) {
	query := `
		SELECT DISTINCT ON ("s"."id")
	        "s"."id",
			"s"."name"
		FROM
			"subject"."subject" s
		LEFT JOIN
			"curriculum_group"."subject_group" sg
			ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN
			"curriculum_group"."year" y
			ON "sg"."year_id" = "y"."id"
		LEFT JOIN
			"curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		LEFT JOIN
			"curriculum_group"."curriculum_group" cg
			ON "y"."curriculum_group_id" = "cg"."id"
		LEFT JOIN
			"school"."school_subject" ss
			ON "s"."id" = "ss"."subject_id"
		LEFT JOIN
			"class"."class" c
			ON "ss"."school_id" = "c"."school_id"
		LEFT JOIN
			"school"."class_teacher" ct
			ON "c"."id" = "ct"."class_id"
		LEFT JOIN
			"subject"."subject_teacher" st
			ON "s"."id" = "st"."subject_id"
		WHERE
		    "c"."id" = $2
			AND
            (("ct"."teacher_id" = $1 AND "sy"."short_name" = "c"."year")
            OR
		    ("st"."teacher_id" = $1 AND "st"."academic_year" = "c"."academic_year" AND "sy"."short_name" = "c"."year")
			OR $3 = TRUE)
	`
	args := []interface{}{teacherId, classId, isParent}
	argsIndex := len(args) + 1

	if filter.CurriculumGroupId != 0 {
		query += fmt.Sprintf(` AND "cg"."id" = $%d`, argsIndex)
		args = append(args, filter.CurriculumGroupId)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "s"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	subjectEntities := []constant.SubjectEntity{}
	err := postgresRepository.Database.Select(&subjectEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subjectEntities, nil
}
