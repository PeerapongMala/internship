package storageRepository

type Repository interface {
	UserRoleList(userId string) ([]int, error)
}
