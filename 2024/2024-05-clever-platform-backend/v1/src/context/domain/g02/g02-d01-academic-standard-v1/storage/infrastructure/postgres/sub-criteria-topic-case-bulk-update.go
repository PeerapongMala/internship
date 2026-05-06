package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) SubCriteriaTopicCaseBulkUpdate(tx *sqlx.Tx, subCriteria *constant.SubCriteriaTopicEntity) error {
	baseQuery := `
		UPDATE "curriculum_group"."sub_criteria_topic" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if subCriteria.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subCriteria.Status)
	}
	if !subCriteria.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subCriteria.UpdatedAt)
	}
	if subCriteria.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subCriteria.UpdatedBy)
	}

	query = append(query, fmt.Sprintf(` "admin_login_as" = $%d`, argsIndex))
	argsIndex++
	args = append(args, subCriteria.AdminLoginAs)

	baseQuery += fmt.Sprintf(` %s WHERE "id" = $%d `, strings.Join(query, ","), argsIndex)
	args = append(args, subCriteria.Id)

	_, err := tx.Exec(baseQuery, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
