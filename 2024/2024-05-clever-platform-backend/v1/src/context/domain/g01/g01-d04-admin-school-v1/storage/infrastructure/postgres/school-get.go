package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"

func (postgresRepository *postgresRepository) GetSchoolById(SchoolId int) (constant.SchoolResponse, error) {
	query := `
		SELECT
			"s"."id",
			"s"."image_url",
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
			"s"."deputy_director",
			"s"."deputy_director_phone",
			"s"."registrar",
			"s"."registrar_phone_number",
			"s"."academic_affair_head",
			"s"."academic_affair_head_phone_number",
			"s"."advisor",
			"s"."advisor_phone_number",
			"s"."status",
			"s"."created_at",
			"s"."created_by",
			"s"."updated_at",
			"u"."first_name" AS "updated_by",
			"s"."code",
			"sa"."id" AS "school_affiliation_id",
			"sa"."school_affiliation_group",
			"sa"."type" AS "school_affiliation_type",
			"sa"."name" AS "school_affiliation_name",
			"sa"."short_name" AS "school_affiliation_short_name",
			"sal"."type" AS "lao_type",
			"sal"."province" AS "lao_province",
			"sal"."district" AS "lao_district",
			"sal"."sub_district" AS "lao_sub_district",
			"sao"."inspection_area" AS "obec_inspection_area",
			"sao"."area_office" AS "obec_area_office",
			"sad"."district_zone" AS "doe_district_zone",
			"sad"."district" AS "doe_district"
		FROM "school"."school" s
		LEFT JOIN "school_affiliation"."school_affiliation_school" sas ON "s"."id" = "sas"."school_id"
		LEFT JOIN "school_affiliation"."school_affiliation_lao" sal ON "sas"."school_affiliation_id" = "sal"."school_affiliation_id"
		LEFT JOIN "school_affiliation"."school_affiliation_doe" sad ON "sas"."school_affiliation_id" = "sad"."school_affiliation_id"
		LEFT JOIN "school_affiliation"."school_affiliation_obec" sao ON "sas"."school_affiliation_id" = "sao"."school_affiliation_id"
		LEFT JOIN "school_affiliation"."school_affiliation" sa ON "sas"."school_affiliation_id" = "sa"."id"
		LEFT JOIN "user"."user" u ON "s"."updated_by" = "u"."id"
		WHERE "s"."id" = $1`

	row := postgresRepository.Database.QueryRow(query, SchoolId)
	response := constant.SchoolResponse{}
	err := row.Scan(
		&response.Id,
		&response.ImageUrl,
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
		&response.DeputyDirector,
		&response.DeputyDirectorPhone,
		&response.Registrar,
		&response.RegistrarPhone,
		&response.AcademicAffairHead,
		&response.AcademicAffairHeadPhone,
		&response.Advisor,
		&response.AdvisorPhone,
		&response.Status,
		&response.CreatedAt,
		&response.CreatedBy,
		&response.UpdatedAt,
		&response.UpdatedBy,
		&response.Code,
		&response.SchoolAffiliationId,
		&response.SchoolAffiliationGroup,
		&response.SchoolAffiliationType,
		&response.SchoolAffiliationName,
		&response.SchoolAffiliationShortName,
		&response.LaoType,
		&response.LaoProvince,
		&response.LaoDistrict,
		&response.LaoSubDistrict,
		&response.ObecInspectionArea,
		&response.ObecAreaOffice,
		&response.DoeDistrictZone,
		&response.DoeDistrict,
	)
	if err != nil {
		return constant.SchoolResponse{}, err
	}

	return response, nil
}
