package postgres

func (postgresRepository *postgresRepository) GetAffiliationBySchoolId(schoolId int) (int, error) {
	query := `
	SELECT
	"sa"."id"
	FROM "school_affiliation"."school_affiliation_school" sas
	LEFT JOIN "school_affiliation"."school_affiliation" sa
	ON "sas"."school_affiliation_id" = "sa"."id"
	WHERE "sas"."school_id" = $1
	`
	var schoolAffiliationId int
	err := postgresRepository.Database.QueryRow(query, schoolId).Scan(&schoolAffiliationId)
	if err != nil {
		return 0, nil
	}

	return schoolAffiliationId, nil
}
