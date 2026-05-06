package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubjectGroupUpdate(tx *sqlx.Tx, subjectGroup *constant.SubjectGroupEntity) (*constant.SubjectGroupEntity, error) {
	var QueryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx != nil {
		QueryMethod = tx.QueryRowx
	} else {
		QueryMethod = postgresRepository.Database.QueryRowx
	}
	baseQuery := `
		UPDATE "curriculum_group"."subject_group"
		SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if subjectGroup.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subjectGroup.Status)
	}
	if subjectGroup.SeedSubjectGroupId != 0 {
		query = append(query, fmt.Sprintf(` "seed_subject_group_id" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subjectGroup.SeedSubjectGroupId)
	}
	if !subjectGroup.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subjectGroup.UpdatedAt)
	}
	if subjectGroup.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subjectGroup.UpdatedBy)
	}
	if subjectGroup.FullOption != nil {
		query = append(query, fmt.Sprintf(` "full_option" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subjectGroup.FullOption)
	}
	if subjectGroup.Theme != nil {
		query = append(query, fmt.Sprintf(` "theme" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subjectGroup.Theme)
	}
	if subjectGroup.Url != nil {
		query = append(query, fmt.Sprintf(` "url" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subjectGroup.Url)
	}

	query = append(query, fmt.Sprintf(` "admin_login_as" = $%d`, argsIndex))
	argsIndex++
	args = append(args, subjectGroup.AdminLoginAs)

	baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, subjectGroup.Id)

	subjectGroupEntity := constant.SubjectGroupEntity{}
	err := QueryMethod(
		baseQuery,
		args...,
	).StructScan(&subjectGroupEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &subjectGroupEntity, nil
}
