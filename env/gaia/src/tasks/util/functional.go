package util

func Filter(s []string, fn func(string) bool) []string {
	var res []string

	for _, val := range s {
		if fn(val) {
			res = append(res, val)
		}
	}

	return res
}