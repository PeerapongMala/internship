package postgres

func (postgresRepository *postgresRepository) GetYearByStudentId(studentId string) (string, error) {
	query := `
 SELECT 
	"c"."year"
	FROM "school"."class_student" cs
	LEFT JOIN "class"."class" c
	ON "cs"."class_id" = "c"."id"
	WHERE "cs"."student_id" = $1
	ORDER BY "c"."academic_year" DESC
	LIMIT 1
	
 `
	var Year string
	err := postgresRepository.Database.QueryRow(query, studentId).Scan(&Year)
	if err != nil {
		return "", err
	}
	return Year, nil
}
