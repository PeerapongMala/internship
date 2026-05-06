package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LearningContentCaseBulkUpdate(tx *sqlx.Tx, learningContent *constant.LearningContentEntity) (*constant.LearningContentEntity, error) {
	baseQuery := `
		UPDATE "curriculum_group"."learning_content" SET	
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if learningContent.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, learningContent.Status)
	}
	if !learningContent.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, learningContent.UpdatedAt)
	}
	if learningContent.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, learningContent.UpdatedBy)
	}

	query = append(query, fmt.Sprintf(` "admin_login_as" = $%d`, argsIndex))
	argsIndex++
	args = append(args, learningContent.AdminLoginAs)

	baseQuery += fmt.Sprintf(` %s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, learningContent.Id)

	learningContentEntity := constant.LearningContentEntity{}
	err := tx.QueryRowx(
		baseQuery,
		args...,
	).StructScan(&learningContentEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &learningContentEntity, nil
}
