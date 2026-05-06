package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubjectUpdate(tx *sqlx.Tx, subject *constant.SubjectEntity) (*constant.SubjectEntity, error) {
	baseQuery := `
		UPDATE "subject"."subject" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if subject.Name != "" {
		query = append(query, fmt.Sprintf(` "name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subject.Name)
	}
	if subject.SubjectLanguageType != "" {
		query = append(query, fmt.Sprintf(` "subject_language_type" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subject.SubjectLanguageType)
	}
	if subject.SubjectLanguage != nil {
		query = append(query, fmt.Sprintf(` "subject_language" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subject.SubjectLanguage)
	}
	if subject.ImageUrl != nil {
		query = append(query, fmt.Sprintf(` "image_url" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subject.ImageUrl)
	}
	if subject.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subject.Status)
	}
	if subject.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subject.UpdatedBy)
	}
	if !subject.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subject.UpdatedAt)
	}

	query = append(query, fmt.Sprintf(` "admin_login_as" = $%d`, argsIndex))
	argsIndex++
	args = append(args, subject.AdminLoginAs)

	baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, subject.Id)

	subjectEntity := constant.SubjectEntity{}
	err := tx.QueryRowx(
		baseQuery,
		args...,
	).StructScan(&subjectEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &subjectEntity, nil
}
