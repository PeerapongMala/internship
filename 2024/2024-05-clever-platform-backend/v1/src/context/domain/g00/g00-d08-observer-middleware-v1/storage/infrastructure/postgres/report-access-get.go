package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ReportAccessGet(userId string, reportAccess *constant.ReportAccess) error {
	query := `
		SELECT 
			ARRAY_AGG(DISTINCT "oa"."access_name") AS "access_names",
			ARRAY_AGG(DISTINCT "oa"."area_office") FILTER (WHERE "oa"."area_office" IS NOT NULL) AS "area_offices",
			ARRAY_AGG(DISTINCT "oa"."district_group") FILTER (WHERE "oa"."district_group" IS NOT NULL) AS "district_zones",
			ARRAY_AGG(DISTINCT "oa"."district") FILTER (WHERE "oa"."district" IS NOT NULL) AS "districts",
			ARRAY( 
				SELECT DISTINCT UNNEST(
					ARRAY_AGG("oa"."school_affiliation_id") FILTER (WHERE "oa"."school_affiliation_id" IS NOT NULL) ||
					ARRAY_AGG("sao"."school_affiliation_id") FILTER (WHERE "sao"."school_affiliation_id" IS NOT NULL) ||
					ARRAY_AGG("sad"."school_affiliation_id") FILTER (WHERE "sad"."school_affiliation_id" IS NOT NULL)
				)
			) AS "school_affiliation_ids",
			ARRAY( 
				SELECT DISTINCT UNNEST(
					ARRAY_AGG("oas"."school_id") FILTER (WHERE "oas"."school_id" IS NOT NULL) ||
					ARRAY_AGG("sas"."school_id") FILTER (WHERE "sas"."school_id" IS NOT NULL) ||
					ARRAY_AGG("sas2"."school_id") FILTER (WHERE "sas2"."school_id" IS NOT NULL) ||
					ARRAY_AGG("sas3"."school_id") FILTER (WHERE "sas3"."school_id" IS NOT NULL)
				)
				UNION
				SELECT "school_id" FROM "school"."school_observer" WHERE "user_id" = $1
			) AS "school_ids"
		FROM
			"user".user_observer_access uoa
		LEFT JOIN
			"auth".observer_access oa 
			ON "uoa"."observer_access_id" = "oa"."id"
		LEFT JOIN 
			"auth".observer_access_school oas 
			ON "oa"."id" = "oas"."observer_access_id"
		LEFT JOIN
			"school_affiliation"."school_affiliation_obec" sao
			ON "oa"."area_office" = "sao"."area_office"
		LEFT JOIN
			"school_affiliation"."school_affiliation_school" sas
			ON "sao"."school_affiliation_id" = "sas"."school_affiliation_id" 
		LEFT JOIN
			"school_affiliation"."school_affiliation_doe" sad
			ON ("oa"."district_group" = "sad"."district_zone" AND "oa"."access_name" = $2)
			OR ("oa"."district" = "sad"."district" AND "oa"."access_name" = $3)
		LEFT JOIN
			"school_affiliation"."school_affiliation_school" sas2
			ON "sad"."school_affiliation_id" = "sas2"."school_affiliation_id"
		LEFT JOIN
			"school_affiliation"."school_affiliation_school" sas3
			ON "oa"."school_affiliation_id" = "sas3"."school_affiliation_id"
		WHERE 
			"uoa"."user_id" = $1
	`
	err := postgresRepository.Database.QueryRowx(query, userId, constant.RegionalGroupExecutive, constant.AreaExecutive).StructScan(reportAccess)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
