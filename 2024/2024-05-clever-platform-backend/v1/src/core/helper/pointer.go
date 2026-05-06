package helper

func Deref[T any](ptr *T) T {
	var zero T
	if ptr == nil {
		return zero
	}
	return *ptr
}

func DerefPagination(p *Pagination) *Pagination {
	if p == nil {
		return &Pagination{}
	}
	return p
}

func ToPtr[T any](in T) *T {
	return &in
}
