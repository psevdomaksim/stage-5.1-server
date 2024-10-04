const { Card } = require("../models/models");
const { Op } = require("sequelize");

class CardController {
  async getCards(req, res) {
    let { searchValue } = req.query;

    let cards;

    if (!searchValue) {
      cards = await Card.findAll();
    }

    if (searchValue) {
      cards = await Card.findAll({
        where: {
          [Op.or]: [
            {
              header: {
                [Op.iLike]: `%${searchValue}%`,
              },
            },
            {
              description: {
                [Op.iLike]: `%${searchValue}%`,
              },
            },
          ],
        },
      });
    }

    return res.send(cards);
  };
};

module.exports = new CardController();
