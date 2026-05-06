package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"log"
	"strings"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolAffiliationUpdate(tx *sqlx.Tx, schoolAffiliation *constant.SchoolAffiliationEntity) (*constant.SchoolAffiliationEntity, error) {
	var queryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx != nil {
		queryMethod = tx.QueryRowx
	} else {
		queryMethod = postgresRepository.Database.QueryRowx
	}

	baseQuery := `
		UPDATE "school_affiliation"."school_affiliation" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if schoolAffiliation.Name != "" {
		query = append(query, fmt.Sprintf(` "name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, schoolAffiliation.Name)
	}
	if schoolAffiliation.ShortName != nil {
		query = append(query, fmt.Sprintf(` "short_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, schoolAffiliation.ShortName)
	}
	if schoolAffiliation.Type != "" {
		query = append(query, fmt.Sprintf(` "type" = $%d`, argsIndex))
		argsIndex++
		args = append(args, schoolAffiliation.Type)
	}
	if schoolAffiliation.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, schoolAffiliation.Status)
	}
	if !schoolAffiliation.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, schoolAffiliation.UpdatedAt)
	}
	if schoolAffiliation.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, schoolAffiliation.UpdatedBy)
	}

	schoolAffiliationEntity := constant.SchoolAffiliationEntity{}
	baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, schoolAffiliation.Id)
	baseQuery = fmt.Sprintf(`
			WITH updated_rows AS (
				%s 
			)
			SELECT
				"updated_rows"."id",
				"updated_rows"."school_affiliation_group",
				"updated_rows"."type",
				"updated_rows"."name",
				"updated_rows"."short_name",
				"updated_rows"."status",
				"updated_rows"."created_at",
				"updated_rows"."created_by",
				"updated_rows"."updated_at",
				"u"."first_name" as "updated_by"
			FROM updated_rows
			LEFT JOIN "user"."user" u ON "updated_rows"."updated_by" = u."id"
		`, baseQuery)
	err := queryMethod(
		baseQuery,
		args...,
	).StructScan(&schoolAffiliationEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return &schoolAffiliationEntity, nil

}
