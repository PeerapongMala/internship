package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) EvaluationFormGeneralEvaluationUpdate(tx *sqlx.Tx, in *constant.GradeEvaluationFormGeneralEvaluationEntity) error {
	baseQuery := `
		UPDATE "grade"."evaluation_form_general_evaluation" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := len(args) + 1

	if in.AdditionalData != "" {
		query = append(query, fmt.Sprintf(` "additional_data" = $%d`, argsIndex))
		args = append(args, in.AdditionalData)
		argsIndex++
	}

	if len(query) == 0 {
		return nil
	}

	baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d`, strings.Join(query, ","), argsIndex)
	args = append(args, in.Id)
	_, err := tx.Exec(baseQuery, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
