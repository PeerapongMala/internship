package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolSubjectList(schoolId int, filter constant.SubjectFilter, pagination *helper.Pagination) ([]constant.SubjectEntity, error) {
	query := `
		SELECT DISTINCT ON ("s"."id")
			"s"."id",
			"s"."name",
			"sy"."short_name" AS "year",
			"ct"."name" AS "contract_name",
			"ct"."status" AS "contract_status",
			"c"."name" AS "curriculum_group",
			"s"."updated_at",
			"s"."updated_by",
			CASE
				WHEN "ct"."start_date" >= NOW() AND "ct"."end_date" <= NOW() THEN TRUE
				ELSE FALSE
			END AS "is_expired"
		FROM
			"school"."school_subject" ss
		LEFT JOIN
			"subject"."subject" s
			ON "ss"."subject_id" = "s"."id"
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
			"curriculum_group"."curriculum_group" c
			ON "y"."curriculum_group_id" = "c"."id"
		LEFT JOIN
			"school_affiliation"."contract" ct
			ON "ss"."contract_id" = "ct"."id"
		WHERE
		    "ss"."school_id" = $1
			AND ct."status" = $2
	`
	args := []interface{}{schoolId, "enabled"}
	argsIndex := len(args) + 1

	if filter.Id != 0 {
		query += fmt.Sprintf(` AND "s"."id" = $%d`, argsIndex)
		args = append(args, filter.Id)
		argsIndex++
	}
	if filter.Name != "" {
		query += fmt.Sprintf(` AND "s"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Name+"%")
		argsIndex++
	}
	if filter.CurriculumGroup != "" {
		query += fmt.Sprintf(` AND "c"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.CurriculumGroup+"%")
		argsIndex++
	}
	if filter.Year != "" {
		query += fmt.Sprintf(` AND "sy"."short_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Year+"%")
		argsIndex++
	}
	if filter.ContractName != "" {
		query += fmt.Sprintf(` AND "ct"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.ContractName+"%")
		argsIndex++
	}
	if filter.ContractStatus != "" {
		query += fmt.Sprintf(` AND "ct"."status" = $%d`, argsIndex)
		args = append(args, filter.ContractStatus)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		log.Println(countQuery)
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
