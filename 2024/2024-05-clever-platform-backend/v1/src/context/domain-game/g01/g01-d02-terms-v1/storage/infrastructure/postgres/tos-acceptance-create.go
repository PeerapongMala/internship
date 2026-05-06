package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g01/g01-d02-terms-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) TosAcceptanceCreate(tosAcceptance *constant.TosAcceptanceEntity) error {
	query := `
		INSERT INTO "tos"."tos_acceptance" (
			"user_id",
			"tos_id",
			"accepted_at"
		)
		VALUES ($1, $2, $3)
	`
	_, err := postgresRepository.Database.Exec(
		query,
		tosAcceptance.UserId,
		tosAcceptance.TosId,
		tosAcceptance.AcceptedAt,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
