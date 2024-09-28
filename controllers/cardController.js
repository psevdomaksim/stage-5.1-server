const fs = require("fs");

class cardController {
  async getCards(req, res) {
    let { searchValue } = req.query;
    fs.readFile("./db.json", "utf-8", (err, jsonString) => {
      if (err) {
        res.status(500).json({ message: "Error reading db.json file: " + err });
      } else {
        const data = JSON.parse(jsonString);
        let cards = data.cards;

        if (!searchValue) {
          return res.send(cards);
        }
        if (searchValue) {
          let filteredCards = cards.filter((card) => {
            return (
              card.header.toLowerCase().includes(searchValue.toLowerCase()) ||
              card.description.toLowerCase().includes(searchValue.toLowerCase())
            );
          });
          return res.send(filteredCards);
        }
      }
    });
  }
}

module.exports = new cardController();
