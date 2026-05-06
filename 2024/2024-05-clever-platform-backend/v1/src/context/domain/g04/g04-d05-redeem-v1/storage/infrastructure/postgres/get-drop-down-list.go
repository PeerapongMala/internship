package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d05-redeem-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetAvatarList() ([]constant.AvatarEntity, error) {
	query := `SELECT * FROM game.avatar`
	entities := []constant.AvatarEntity{}
	err := postgresRepository.Database.Select(&entities, query)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}

func (postgresRepository *postgresRepository) GetPetList() ([]constant.PetEntity, error) {
	query := `SELECT * FROM game.pet`
	entities := []constant.PetEntity{}
	err := postgresRepository.Database.Select(&entities, query)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}