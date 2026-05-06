package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SchoolListCsv() ([]constant.SchoolResponseCsv, error) {
	query := `
	SELECT
	"s"."id",
	"s"."code",
	"sa"."name" AS "school_affiliation_name",
	"s"."name",
	"s"."address",
	"s"."region",
	"s"."province",
	"s"."district",
	"s"."sub_district",
	"s"."post_code",
	"s"."latitude",
	"s"."longtitude",
	"s"."director",
	"s"."director_phone_number",
	"s"."registrar",
	"s"."registrar_phone_number",
	"s"."academic_affair_head",
	"s"."academic_affair_head_phone_number",
	"s"."advisor",
	"s"."advisor_phone_number",
   	"s"."created_at",
	"s"."status"
	FROM "school"."school" s
	LEFT JOIN "school_affiliation"."school_affiliation_school" scs
	ON "s"."id" = "scs"."school_id"
	LEFT JOIN "school_affiliation"."school_affiliation" sa
	ON "scs"."school_affiliation_id"  = "sa"."id"
	`
	rows, err := postgresRepository.Database.Query(query)
	if err != nil {
		return nil, err
	}
	responses := []constant.SchoolResponseCsv{}

	for rows.Next() {
		response := constant.SchoolResponseCsv{}
		err := rows.Scan(
			&response.Id,
			&response.Code,
			&response.SchoolAffiliationName,
			&response.Name,
			&response.Address,
			&response.Region,
			&response.Province,
			&response.District,
			&response.SubDistrict,
			&response.PostCode,
			&response.Latitude,
			&response.Longtitude,
			&response.Director,
			&response.DirectorPhone,
			&response.Registrar,
			&response.RegistrarPhone,
			&response.AcademicAffairHead,
			&response.AcademicAffairHeadPhone,
			&response.Advisor,
			&response.AdvisorPhone,
			&response.CreatedAt,
			&response.Status,
		)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		responses = append(responses, response)
	}
	return responses, nil
}
