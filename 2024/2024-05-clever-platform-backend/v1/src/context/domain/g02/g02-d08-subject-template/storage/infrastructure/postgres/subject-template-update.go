package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d08-subject-template/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) SubjectTemplateUpdate(tx *sqlx.Tx, template *constant.SubjectTemplateEntity) error {
	baseQuery := `
		UPDATE "grade"."subject_template" SET	
	`

	query := []string{}
	args := []interface{}{}
	argsIndex := len(args) + 1

	if template.Name != nil {
		query = append(query, fmt.Sprintf(` "name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, template.Name)
	}
	if template.Status != nil {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, template.Status)
	}
	if template.WizardIndex != nil {
		query = append(query, fmt.Sprintf(` "wizard_index" = $%d`, argsIndex))
		argsIndex++
		args = append(args, template.WizardIndex)
	}

	if len(query) == 0 {
		return nil
	}
	if template.UpdatedAt != nil {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, template.UpdatedAt)
	}
	if template.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, template.UpdatedBy)
	}

	baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d`, strings.Join(query, ","), argsIndex)
	args = append(args, template.Id)

	_, err := tx.Exec(baseQuery, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
