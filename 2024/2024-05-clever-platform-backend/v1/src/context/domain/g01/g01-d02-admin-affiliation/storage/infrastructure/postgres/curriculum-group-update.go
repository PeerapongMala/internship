package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) CurriculumGroupUpdate(tx *sqlx.Tx, curriculumGroup *constant.CurriculumGroupEntity) (*constant.CurriculumGroupEntity, error) {
	var queryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx != nil {
		queryMethod = tx.QueryRowx
	} else {
		queryMethod = postgresRepository.Database.QueryRowx
	}

	baseQuery := `
		UPDATE "curriculum_group"."curriculum_group" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if curriculumGroup.Name != "" {
		query = append(query, fmt.Sprintf(` "name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, curriculumGroup.Name)
	}
	if curriculumGroup.ShortName != "" {
		query = append(query, fmt.Sprintf(` "short_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, curriculumGroup.ShortName)
	}
	if curriculumGroup.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, curriculumGroup.Status)
	}
	if !curriculumGroup.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, curriculumGroup.UpdatedAt)
	}
	if curriculumGroup.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, curriculumGroup.UpdatedBy)
	}

	baseQuery += fmt.Sprintf(`%s WHERE "curriculum_group"."id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, curriculumGroup.Id)

	curriculumGroupEntity := constant.CurriculumGroupEntity{}
	err := queryMethod(
		baseQuery,
		args...,
	).StructScan(&curriculumGroupEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &curriculumGroupEntity, nil
}
