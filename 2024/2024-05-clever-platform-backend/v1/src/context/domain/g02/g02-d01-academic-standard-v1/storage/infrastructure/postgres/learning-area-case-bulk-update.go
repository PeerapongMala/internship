package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LearningAreaCaseBulkUpdate(tx *sqlx.Tx, learningArea *constant.LearningAreaEntity) (*constant.LearningAreaEntity, error) {
	baseQuery := `
		UPDATE "curriculum_group"."learning_area" SET	
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if learningArea.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, learningArea.Status)
	}
	if !learningArea.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, learningArea.UpdatedAt)
	}
	if learningArea.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, learningArea.UpdatedBy)
	}

	query = append(query, fmt.Sprintf(` "admin_login_as" = $%d`, argsIndex))
	argsIndex++
	args = append(args, learningArea.AdminLoginAs)

	baseQuery += fmt.Sprintf(` %s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, learningArea.Id)

	learningAreaEntity := constant.LearningAreaEntity{}
	err := tx.QueryRowx(
		baseQuery,
		args...,
	).StructScan(&learningAreaEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &learningAreaEntity, nil
}
