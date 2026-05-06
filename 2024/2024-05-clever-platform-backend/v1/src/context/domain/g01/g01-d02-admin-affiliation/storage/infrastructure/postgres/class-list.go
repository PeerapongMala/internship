package postgres

import (
	"github.com/lib/pq"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ClassList(schoolIds []int) ([]int, error) {
	query := `
		SELECT DISTINCT ON ("id")
			"id"
		FROM
			"class"."class"
		WHERE
			"school_id" = ANY($1) 
	`
	classIds := []int{}
	err := postgresRepository.Database.Select(&classIds, query, pq.Array(schoolIds))
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return classIds, nil
}
