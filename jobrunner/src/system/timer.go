package system

import "time"

func timer(ch chan <- channelUpdate, d time.Duration, code channelUpdate) {
	go func() {
		time.Sleep(d)
		ch <- code
	}()
}