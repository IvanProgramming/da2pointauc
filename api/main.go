package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
)

type RequestBody struct {
	Url string `json:"url"`
}

type DaPollItem struct {
	Title       string `json:"title"`
	AmountValue int    `json:"amount_value"`
}

type DAPoll struct {
	Options []DaPollItem `json:"options"`
}

type DAResp struct {
	Poll           DAPoll `json:"poll"`
	PerAmountVotes R      `json:"per_amount_votes"`
}

type DaBaseResp struct {
	Data DAResp `json:"data"`
}

type PointAucItem struct {
	Amount int    `json:"amount"`
	FastId int    `json:"fastId"`
	Name   string `json:"name"`
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
		nick := strings.Trim(strings.TrimPrefix(body.Url, "https://donationalerts.com/r/"), "/ ")
		if nick == "" {
			http.Error(w, `{"error": "Invalid url"}`, http.StatusBadRequest)
			return
		}
		// Making a request to the url
		resp, err := http.Get("https://www.donationalerts.com/api/v1/user/" + nick + "/donationpagesettings")
		if err != nil {
			http.Error(w, `{"error": "Something went wrong"}`, http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()
		respBaseJson := DaBaseResp{}
		json.NewDecoder(resp.Body).Decode(&respBaseJson)
		log.Print(respBaseJson)
		respJson := respBaseJson.Data
		// Checking if the user has a poll
		if len(respJson.Poll.Options) == 0 {
			http.Error(w, `{"error": "This user has no poll"}`, http.StatusBadRequest)
			return
		}

		auks := []PointAucItem{}
		for i, v := range respJson.Poll.Options {
			auks = append(auks, PointAucItem{
				Amount: v.AmountValue / respJson.PerAmountVotes["RUB"].(int),
				FastId: i + 1,
				Name:   v.Title,
			})
		}
		json.NewEncoder(w).Encode(auks)

	} else {
		http.Error(w, `{"error": "Invalid url"}`, http.StatusBadRequest)
		return
	}

}
