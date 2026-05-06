package postgres

import (
	"fmt"
	"log"
	"sort"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentList(filter *constant.StudentFilter, pagination *helper.Pagination) ([]constant.StudentDataWithOauthEntity, error) {
	query := `
		SELECT
			s.*,
			u.*,
			ao.*,
			aep.user_id IS NOT NULL AS "have_password"
		FROM
			"user"."student" s
		LEFT JOIN
			"user"."user" u
			ON "s"."user_id" = "u"."id"
		LEFT JOIN
			"auth"."auth_oauth" ao
			ON "u"."id" = "ao"."user_id"
		LEFT JOIN
			"auth"."auth_pin" aep
			ON "u"."id" = "aep"."user_id"
		WHERE
			TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	if filter.Id != "" {
		query += fmt.Sprintf(` AND "u"."id" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Id+"%")
		argsIndex++
	}
	if filter.SchoolId != 0 {
		query += fmt.Sprintf(` AND "s"."school_id" = $%d`, argsIndex)
		args = append(args, filter.SchoolId)
		argsIndex++
	}
	if filter.StudentId != "" {
		query += fmt.Sprintf(` AND "s"."student_id" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.StudentId+"%")
		argsIndex++
	}
	if filter.Title != "" {
		query += fmt.Sprintf(` AND "u"."title" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Title+"%")
		argsIndex++
	}
	if filter.FirstName != "" {
		query += fmt.Sprintf(` AND "u"."first_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.FirstName+"%")
		argsIndex++
	}
	if filter.LastName != "" {
		query += fmt.Sprintf(` AND "u"."last_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.LastName+"%")
		argsIndex++
	}
	if filter.Email != "" {
		query += fmt.Sprintf(` AND "u"."email" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Email+"%")
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "u"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}
	if filter.StartDate != nil {
		query += fmt.Sprintf(` AND "u"."created_at" >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex++
	}
	if filter.EndDate != nil {
		query += fmt.Sprintf(` AND "u"."created_at" <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "s"."student_id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	type StudentWithOauth struct {
		*constant.StudentDataEntity
		*constant.AuthOauthEntity
	}
	studentWithOauthList := []StudentWithOauth{}
	err := postgresRepository.Database.Select(&studentWithOauthList, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	studentDataWithOauthList := map[string]constant.StudentDataWithOauthEntity{}
	for _, studentWithOauth := range studentWithOauthList {
		_, exists := studentDataWithOauthList[studentWithOauth.Id]
		if !exists {
			studentDataWithOauthList[studentWithOauth.Id] = constant.StudentDataWithOauthEntity{
				StudentDataEntity: studentWithOauth.StudentDataEntity,
			}
		}

		studentDataWithOauth := studentDataWithOauthList[studentWithOauth.Id]
		if studentWithOauth.AuthOauthEntity.Provider != nil {
			studentDataWithOauth.Oauth = append(studentDataWithOauth.Oauth, *studentWithOauth.AuthOauthEntity)
		}
		studentDataWithOauthList[studentWithOauth.Id] = studentDataWithOauth
	}

	studentDataWithOauthEntities := []constant.StudentDataWithOauthEntity{}
	for _, studentDataWithOauth := range studentDataWithOauthList {
		if studentDataWithOauth.Oauth == nil {
			studentDataWithOauth.Oauth = []constant.AuthOauthEntity{}
		}
		studentDataWithOauthEntities = append(studentDataWithOauthEntities, studentDataWithOauth)
	}

	sort.Slice(studentDataWithOauthEntities, func(i, j int) bool {
		return studentDataWithOauthEntities[i].StudentId < studentDataWithOauthEntities[j].StudentId
	})

	return studentDataWithOauthEntities, nil
}
