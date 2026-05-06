package postgres

func (postgresRepository *postgresRepository) GetMaxScoreCount(levelIds []int, studentIds []string) (count int, err error) {
	query := `
		SELECT COALESCE(SUM("star"),0) AS "count"
		FROM (
			SELECT 
				"lpl"."student_id",
				"lpl"."level_id",
				MAX("lpl"."star") AS "star"
			FROM "level"."level_play_log" lpl
			WHERE "lpl"."student_id" = ANY($1)
				AND "lpl"."level_id" = ANY($2)
			GROUP BY "lpl"."student_id", "lpl"."level_id"
		) AS max_scores
	`
	err = postgresRepository.Database.QueryRowx(query, studentIds, levelIds).Scan(&count)
	if err != nil {
		return count, err
	}

	return count, nil
}
