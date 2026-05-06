package postgres

import (
	"fmt"
	"github.com/pkg/errors"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) SchoolAffiliationList(filter constant.SchoolAffiliationFilter, pagination *helper.Pagination) ([]constant.SchoolAffiliationList, int, error) {
	query := `
		SELECT
			sa.id,
			sa.school_affiliation_group,
			sa.type,
			sa.name,
			sa.short_name,
			sal.type AS lao_type,
			sal.province AS lao_province,
			sal.district AS lao_district,
			sal.sub_district AS lao_sub_district,
			sao.inspection_area AS obec_inspection_area,
			sao.area_office AS obec_area_office,
			sad.district_zone AS doe_district_zone,
			sad.district AS doe_district
		FROM school_affiliation.school_affiliation sa
		LEFT JOIN school_affiliation.school_affiliation_lao sal ON sa.id = sal.school_affiliation_id
		LEFT JOIN school_affiliation.school_affiliation_doe sad ON sa.id = sad.school_affiliation_id
		LEFT JOIN school_affiliation.school_affiliation_obec sao ON sa.id = sao.school_affiliation_id
		WHERE TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	if filter.SchoolAffiliationId != 0 {
		query += fmt.Sprintf(` AND sa.id = $%d`, argsIndex)
		args = append(args, filter.SchoolAffiliationId)
		argsIndex++
	}
	if filter.SchoolAffiliationDoeId != 0 {
		query += fmt.Sprintf(` AND sae.school_affiliation_id = $%d`, argsIndex)
		args = append(args, filter.SchoolAffiliationDoeId)
		argsIndex++
	}
	if filter.SchoolAffiliationGroup != "" {
		query += fmt.Sprintf(` AND sa.school_affiliation_group = $%d`, argsIndex)
		args = append(args, filter.SchoolAffiliationGroup)
		argsIndex++
	}
	if filter.Type != "" {
		query += fmt.Sprintf(` AND sa.type = $%d`, argsIndex)
		args = append(args, filter.Type)
		argsIndex++
	}
	if filter.Name != "" {
		query += fmt.Sprintf(` AND (sa.name ILIKE $%d OR sa.short_name ILIKE $%d)`, argsIndex, argsIndex)
		args = append(args, "%"+filter.Name+"%")
		argsIndex += 1
	}
	if filter.ShortName != "" {
		query += fmt.Sprintf(` AND sa.short_name ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.ShortName+"%")
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, 0, err
		}
		query += fmt.Sprintf(` ORDER BY "sa"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	schoolAffiliations := []constant.SchoolAffiliationList{}
	err := postgresRepository.Database.Select(&schoolAffiliations, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}

	return schoolAffiliations, 0, nil
}
