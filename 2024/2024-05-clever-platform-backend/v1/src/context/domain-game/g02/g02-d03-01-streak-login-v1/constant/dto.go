package constant

type InventoryDTO struct {
	StudentId  string
	GoldCoin   int
	ArcadeCoin int
	IceAmount  int
	AvatarId  *int
	PetId     *int
}

type ItemToMailBoxDTO struct {
	SubjectId  int
	StudentId  string
	ItemId     int
	ItemAmount int
}
