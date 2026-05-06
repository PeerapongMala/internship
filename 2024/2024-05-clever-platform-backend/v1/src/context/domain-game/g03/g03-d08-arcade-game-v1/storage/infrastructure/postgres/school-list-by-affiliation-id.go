package postgres

func (postgresRepository *postgresRepository) SchoolListByAffiliationId(AffiliationId int) ([]int, error) {
	query := `
SELECT 
	school_id
FROM "school_affiliation"."school_affiliation_school"
WHERE school_affiliation_id = $1
`
	rows, err := postgresRepository.Database.Query(query, AffiliationId)
	if err != nil {
		return nil, err
	}
	responses := []int{}
	for rows.Next() {
		var id int
		rows.Scan(
			&id,
		)
		responses = append(responses, id)
	}
	return responses, nil
}
