package postgres

import (
	"database/sql"
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ParentUpdate(tx *sqlx.Tx, parent *constant.ParentEntity) error {
	type QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.Exec
		}
		return postgresRepository.Database.Exec
	}()

	baseQuery := `
		UPDATE "user"."parent" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1
	if parent.Relationship != "" {
		query = append(query, fmt.Sprintf(` "relationship" = $%d`, argsIndex))
		argsIndex++
		args = append(args, parent.Relationship)
	}
	if parent.BirthDate.IsZero() {
		query = append(query, fmt.Sprintf(` "birth_date" = $%d`, argsIndex))
		argsIndex++
		args = append(args, parent.BirthDate)
	}
	if parent.PhoneNumber != nil {
		query = append(query, fmt.Sprintf(` "phone_number" = $%d`, argsIndex))
		argsIndex++
		args = append(args, parent.PhoneNumber)
	}

	if len(query) > 0 {
		baseQuery += fmt.Sprintf(`%s WHERE "user_id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
		args = append(args, parent.UserId)
	}

	_, err := queryMethod(baseQuery, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
