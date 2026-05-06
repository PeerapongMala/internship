package postgres

func (postgresRepository *postgresRepository) CriteriaCaseGetCurriculumGroupId(criteriaId int) (*int, error) {
	query := `
		SELECT
			"la"."curriculum_group_id"
		FROM
			"curriculum_group"."criteria" c
		LEFT JOIN
			"curriculum_group"."content" ct
			ON "c"."content_id" = "ct"."id"	
		LEFT JOIN 
			"curriculum_group"."learning_area" la
			ON "ct"."learning_area_id" = "la"."id"
		WHERE
			"c"."id" = $1
	`
	var curriculumGroupId *int
	err := postgresRepository.Database.QueryRowx(query, criteriaId).Scan(&curriculumGroupId)
	if err != nil {
		return nil, err
	}

	return curriculumGroupId, nil
}
