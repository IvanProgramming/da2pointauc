package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"sort"
	"strings"

	"github.com/google/uuid"
)

type RequestBody struct {
	Url string `json:"url"`
}

type DaResp struct {
	Data struct {
		Poll struct {
			Options []struct {
				ID            int     `json:"id"`
				Title         string  `json:"title"`
				AmountValue   int     `json:"amount_value"`
				AmountPercent float64 `json:"amount_percent"`
				IsWinner      int     `json:"is_winner"`
			} `json:"options"`
			PerAmountVotes struct {
				RUB int `json:"RUB"`
			} `json:"per_amount_votes"`
		} `json:"poll"`
	} `json:"data"`
}

type PointAucItem struct {
	Amount int    `json:"amount"`
	FastId int    `json:"fastId"`
	Name   string `json:"name"`
	Id     string `json:"id"`
}

type R map[string]interface{}

func Handler(w http.ResponseWriter, r *http.Request) {
	// Unpacking json body
	var body RequestBody
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	log.Print(body.Url)
	// Checking if url is valid
	if strings.HasPrefix(body.Url, "https://donationalerts.com/r/") || strings.HasPrefix(body.Url, "https://www.donationalerts.com/r/") {
		// If url is valid, we can make a request to the url with that nickname
		var nick string
		if strings.HasPrefix(body.Url, "https://www.donationalerts.com/r/") {
			nick = strings.Trim(strings.TrimPrefix(body.Url, "https://www.donationalerts.com/r/"), "/ ")
		} else {
			nick = strings.Trim(strings.TrimPrefix(body.Url, "https://donationalerts.com/r/"), "/ ")
		}
		if nick == "" {
			http.Error(w, `{"error": "Invalid url"}`, http.StatusBadRequest)
			return
		}
		log.Printf("Nick: %s\n", nick)
		// Making a request to the url
		resp, err := http.Get("https://www.donationalerts.com/api/v1/user/" + nick + "/donationpagesettings")
		if err != nil {
			http.Error(w, `{"error": "Something went wrong"}`, http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()
		respBaseJson := DaResp{}
		json.NewDecoder(resp.Body).Decode(&respBaseJson)
		log.Print(respBaseJson)
		respJson := respBaseJson.Data
		// Checking if the user has a poll
		if len(respJson.Poll.Options) == 0 {
			http.Error(w, `{"error": "This user has no poll"}`, http.StatusBadRequest)
			return
		}
		// Sorting the poll
		sort.Slice(respJson.Poll.Options, func(i, j int) bool {
			return respJson.Poll.Options[i].AmountValue < respJson.Poll.Options[j].AmountValue
		})
		auks := []PointAucItem{}
		for i, v := range respJson.Poll.Options {
			auks = append(auks, PointAucItem{
				Amount: v.AmountValue / respJson.Poll.PerAmountVotes.RUB,
				FastId: i + 1,
				Name:   v.Title,
				Id:     uuid.New().String(),
			})
		}
		json.NewEncoder(w).Encode(auks)

	} else {
		http.Error(w, `{"error": "Invalid url"}`, http.StatusBadRequest)
		return
	}

}
