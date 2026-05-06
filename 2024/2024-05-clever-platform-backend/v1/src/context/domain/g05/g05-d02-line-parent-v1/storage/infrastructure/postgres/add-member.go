package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"log"
	"net/http"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AddMember(familyID int, usersID string) error {
	query := `
		SELECT EXISTS (
			SELECT 1
			FROM family.family_member fm
			WHERE fm.user_id = $1
		)
	`

	var exist bool
	err := postgresRepository.Database.QueryRowx(query, usersID).Scan(&exist)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	if exist {
		//return errors.New("User already exists in family")
		msg := "User already exists in family"
		return helper.NewHttpError(http.StatusConflict, &msg)
	}

	query = `
		INSERT INTO "family"."family_member" (
			"family_id",
			"user_id",
			"is_owner"
		)
		VALUES ($1, $2, false)
	`

	agrs := []interface{}{familyID, usersID}
	_, err = postgresRepository.Database.Exec(query, agrs...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
