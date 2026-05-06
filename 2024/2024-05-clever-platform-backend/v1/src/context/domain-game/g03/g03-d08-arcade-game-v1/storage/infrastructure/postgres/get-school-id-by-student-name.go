package postgres

func (postgresRepository *postgresRepository) GetSchoolIdByStudentName(studentName string) (int, error) {
	query := `
	SELECT 
		"sc"."id"
		FROM "user"."student" st
		LEFT JOIN "school"."school" sc
		ON "st"."school_id" = "sc"."id"
		WHERE "st"."user_id" = $1


`
	var SchoolId int
	err := postgresRepository.Database.QueryRow(query, studentName).Scan(&SchoolId)
	if err != nil {
		return 0, err
	}
	return SchoolId, nil
}
