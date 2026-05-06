package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ObserverAccessCreate(tx *sqlx.Tx, in *constant.ObserverAccessEntity) (*constant.ObserverAccessEntity, error) {
	type QueryMethod func(query string, args ...interface{}) *sqlx.Row
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.QueryRowx
		}
		return postgresRepository.Database.QueryRowx
	}()
	query := `
    INSERT INTO "auth"."observer_access" (
      "access_name",
      "name",
      "area_office",
      "district_group",
      "district",
      "school_affiliation_id",
      "status",
      "created_at",
      "created_by"
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
		RETURNING *
  `
	observerAccess := constant.ObserverAccessEntity{}
	err := queryMethod(
		query,
		in.AccessName,
		in.Name,
		in.AreaOffice,
		in.DistrictGroup,
		in.District,
		in.SchoolAffiliationId,
		in.Status,
		in.CreatedAt,
		in.CreatedBy,
	).StructScan(&observerAccess)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &observerAccess, nil
}
