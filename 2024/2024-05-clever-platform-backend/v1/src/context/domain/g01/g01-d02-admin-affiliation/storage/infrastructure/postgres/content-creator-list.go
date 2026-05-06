package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	RoleConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ContentCreatorList(filter *constant.UserFilter, pagination *helper.Pagination) ([]constant.UserEntity, error) {
	query := `
		SELECT DISTINCT ON ("u"."id")
			"u"."id",
			"u"."email",
			"u"."title",
			"u"."first_name",
			"u"."last_name",
			"u"."id_number",
			"u"."last_login"
		FROM
			"user"."user" u
		LEFT JOIN
			"user"."user_role" ur
			ON "u"."id" = "ur"."user_id"
		LEFT JOIN "curriculum_group"."curriculum_group_content_creator" cgcc
			ON "u"."id" = "cgcc"."content_creator_id"
		WHERE
		    "ur"."role_id" = $1
	`
	args := []interface{}{RoleConstant.ContentCreator}
	argsIndex := 2

	if filter.CurriculumGroupId != 0 {
		query += fmt.Sprintf(` AND "cgcc"."curriculum_group_id" = $%d`, argsIndex)
		args = append(args, filter.CurriculumGroupId)
		argsIndex++
	}
	if filter.Id != "" {
		query += fmt.Sprintf(` AND "u"."id" = $%d`, argsIndex)
		args = append(args, filter.Id)
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
	if !filter.StartDate.IsZero() {
		query += fmt.Sprintf(` AND "u"."created_at" >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex++
	}
	if !filter.EndDate.IsZero() {
		query += fmt.Sprintf(` AND "u"."created_at" <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	userEntities := []constant.UserEntity{}
	err := postgresRepository.Database.Select(&userEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return userEntities, nil
}
