package postgres

import (
	"fmt"
	"log"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ContractCaseListSchool(contractId int, filter *constant2.ContractSchoolFilter, pagination *helper.Pagination) ([]interface{}, error) {
	query := `
		SELECT
			s."id",
			s."code",
			s."name",
			"sa"."id" as "school_affiliation_id",
			"sa"."school_affiliation_group" as "school_affiliation_type"
		FROM "school_affiliation".contract_school cs 
		LEFT JOIN "school"."school" s
			ON cs."school_id" = s."id"
		LEFT JOIN "school_affiliation"."contract" c
			ON "cs"."contract_id" = "c"."id"
		LEFT JOIN "school_affiliation"."school_affiliation" sa
			ON "c"."school_affiliation_id" = "sa"."id"
		WHERE cs."contract_id" = $1
	`
	args := []interface{}{contractId}
	argsIndex := 2

	if filter.SearchText != "" {
		query += fmt.Sprintf(` AND ("s"."name" ILIKE $%d`, argsIndex)
		argsIndex++
		arg := "%" + filter.SearchText + "%"
		args = append(args, arg)
		intSearchText, err := strconv.Atoi(filter.SearchText)
		if err == nil {
			query += fmt.Sprintf(` OR "s"."id" = $%d`, argsIndex)
			args = append(args, intSearchText)
			argsIndex++
		}
		query += ")"
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(`  ORDER BY "s"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	contractSchoolDataEntities := []constant2.ContractSchoolDataEntity{}
	err := postgresRepository.Database.Select(&contractSchoolDataEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	schoolDoeQuery := `
		SELECT
			"district_zone",
			"district"
		FROM "school_affiliation"."school_affiliation_doe"
		WHERE
			"school_affiliation_id" = $1	
	`
	schoolObecQuery := `
		SELECT
			"inspection_area",
			"area_office"	
		FROM "school_affiliation"."school_affiliation_obec"
		WHERE
			"school_affiliation_id" = $1
	`
	schoolLaoQuery := `
		SELECT
			"type" as "lao_type",
			"district",
			"sub_district",
			"province"
		FROM "school_affiliation"."school_affiliation_lao"
		WHERE
			"school_affiliation_id" = $1
	`
	schools := []interface{}{}
	for _, contractSchoolDataEntity := range contractSchoolDataEntities {
		switch contractSchoolDataEntity.SchoolAffiliationType {
		case string(constant.Doe):
			contractSchoolDoeDataEntity := constant.ContractSchoolDoeDataEntity{}
			err := postgresRepository.Database.QueryRowx(schoolDoeQuery, contractSchoolDataEntity.SchoolAffiliationId).StructScan(&contractSchoolDoeDataEntity)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}
			contractSchoolDoeDataEntity.ContractSchoolDataEntity = contractSchoolDataEntity
			schools = append(schools, contractSchoolDoeDataEntity)
		case string(constant.Obec):
			contractSchoolObecDataEntity := constant.ContractSchoolObecDataEntity{}
			err := postgresRepository.Database.QueryRowx(schoolObecQuery, contractSchoolDataEntity.SchoolAffiliationId).StructScan(&contractSchoolObecDataEntity)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}
			contractSchoolObecDataEntity.ContractSchoolDataEntity = contractSchoolDataEntity
			schools = append(schools, contractSchoolObecDataEntity)
		case string(constant.Lao):
			contractSchoolLaoDataEntity := constant.ContractSchoolLaoDataEntity{}
			err := postgresRepository.Database.QueryRowx(schoolLaoQuery, contractSchoolDataEntity.SchoolAffiliationId).StructScan(&contractSchoolLaoDataEntity)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}
			contractSchoolLaoDataEntity.ContractSchoolDataEntity = contractSchoolDataEntity
			schools = append(schools, contractSchoolLaoDataEntity)
		default:
			schools = append(schools, contractSchoolDataEntity)
		}
	}

	return schools, nil
}
