package service

import (
	redeemStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d03-redeem-v1/storage/storage-repository"
)

func ServiceNew(redeemStorage redeemStorage.RedeemRepository) ServiceInterface {
	return &serviceStruct{
		redeemStorage: redeemStorage,	
	}
}

type serviceStruct struct {
	redeemStorage redeemStorage.RedeemRepository
}

type APIStruct struct {
	Service ServiceInterface
}
