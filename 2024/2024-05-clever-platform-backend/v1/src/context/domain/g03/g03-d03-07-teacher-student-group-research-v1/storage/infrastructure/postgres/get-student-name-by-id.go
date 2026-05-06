package postgres

import (
	"fmt"
	"github.com/pkg/errors"
	"log"
)

func (p *postgresRepository) GetStudentNameById(studentId string) (*string, error) {

	query := fmt.Sprintf(`
		SELECT
		    concat(title, first_name, ' ', last_name)
		FROM "user"."user"
		WHERE id = $1
	`)

	var fullname string

	// Scan JSON result into a byte slice
	if err := p.Database.QueryRowx(query, studentId).Scan(&fullname); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return &fullname, nil
}
