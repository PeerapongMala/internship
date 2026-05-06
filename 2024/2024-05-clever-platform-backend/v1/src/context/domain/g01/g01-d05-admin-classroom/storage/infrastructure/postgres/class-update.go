package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ClassUpdate(tx *sqlx.Tx, class *constant.ClassEntity) (*constant.ClassEntity, error) {
	var queryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx != nil {
		queryMethod = tx.QueryRowx
	} else {
		queryMethod = postgresRepository.Database.QueryRowx
	}

	baseQuery := `
		UPDATE "class"."class" SET
	`
	query := []string{}
	args := []interface{}{}
	idx := 1

	if class.AcademicYear != 0 {
		query = append(query, fmt.Sprintf(`"academic_year" = $%d`, idx))
		args = append(args, class.AcademicYear)
		idx++
	}
	if class.Year != "" {
		query = append(query, fmt.Sprintf(`"year" = $%d`, idx))
		args = append(args, class.Year)
		idx++
	}
	if class.Name != "" {
		query = append(query, fmt.Sprintf(`"name" = $%d`, idx))
		args = append(args, class.Name)
		idx++
	}
	if class.Status != "" {
		query = append(query, fmt.Sprintf(`"status" = $%d`, idx))
		args = append(args, class.Status)
		idx++
	}
	if class.UpdatedAt != nil {
		query = append(query, fmt.Sprintf(`"updated_at" = $%d`, idx))
		args = append(args, class.UpdatedAt)
		idx++
	}
	if class.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(`"updated_by" = $%d`, idx))
		args = append(args, class.UpdatedBy)
		idx++
	}

	if len(query) == 0 {
		// no updates
		return class, nil
	}

	baseQuery += strings.Join(query, ",")
	baseQuery += fmt.Sprintf(` WHERE "id" = $%d RETURNING *;`, idx)
	args = append(args, class.Id)

	classEntity := constant.ClassEntity{}
	err := queryMethod(baseQuery, args...).StructScan(&classEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &classEntity, nil
}
