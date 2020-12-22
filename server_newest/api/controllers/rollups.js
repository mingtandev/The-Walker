const mongoose = require("mongoose");

const Rollup = require("../models/rollup");
const Item = require("../models/item");
const User = require("../models/user");

const { saveHistory, loadHistory } = require("./../utils/history");
const { saveStatistic } = require("./../utils/statistic");
const { saveUserItem } = require("./../utils/userItem");

exports.getAll = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const items_per_page = parseInt(req.query.limit) || 100;

  if (page < 1) page = 1;

  Rollup.find({})
    .select("_id day thumbnail coin item")
    .skip((page - 1) * items_per_page)
    .limit(items_per_page)
    .then(async (rolls) => {
      const request = {};
      const len = await Rollup.find({}).countDocuments();

      request.currentPage = page;
      request.totalPages = Math.ceil(len / items_per_page);

      if (page > 1) {
        request.previous = {
          page: page - 1,
          limit: items_per_page,
        };
      }

      if (page * items_per_page < len) {
        request.next = {
          page: page + 1,
          limit: items_per_page,
        };
      }

      const response = {
        msg: "success",
        length: rolls.length,
        rolls: rolls.map((roll) => {
          return {
            _id: roll._id,
            day: roll.day,
            coin: roll.coin,
            thumbnail: roll.thumbnail,
            item: roll.item,
            request: {
              type: "GET",
              url: req.hostname + "/rolls/" + roll.day,
            },
          };
        }),
        request,
      };

      // res.set('Content-Range', ``);
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        msg: "Server error!",
        error,
      });
    });
};

exports.getOne = (req, res, next) => {
  const { rollupDay } = req.params;

  Rollup.findOne({ day: rollupDay })
    .select("_id day thumbnail coin item")
    .then((roll) => {
      if (!roll) {
        return res.status(202).json({
          msg: "ValidatorError",
          errors: {
            user: `Roll not found!`,
          },
        });
      }

      res.status(200).json({
        msg: "success",
        roll: {
          _id: roll._id,
          day: roll.day,
          thumbnail: roll.thumbnail,
          coin: roll.coin,
          item: roll.item,
          request: {
            type: "GET",
            url: req.hostname + "/rolls",
          },
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        msg: "Server error!",
        error,
      });
    });
};

exports.use = async (req, res, next) => {
  const { rollupDay } = req.params;
  const userId = req.userData._id;

  if (rollupDay != new Date().getDate()) {
    return res.status(202).json({
      msg: "ValidatorError",
      errors: {
        user: `Today is not ${rollupDay}!`,
      },
    });
  }

  try {
    const history = await loadHistory(userId, "rolls", "personal");
    const historyRollupDays = history.map((his) => his.split(" ")[2]);

    if (historyRollupDays.includes(rollupDay)) {
      return res.status(202).json({
        msg: "ValidatorError",
        errors: {
          user: `You has been registered today!`,
        },
      });
    }

    const roll = await Rollup.findOne({ day: rollupDay });

    const [, , result] = await Promise.all([
      saveHistory(
        userId,
        "rolls",
        "personal",
        `Roll up: ${rollupDay} | ${new Date()}`
      ),
      saveStatistic(0, 1, 0, 0, 0, 0),
      saveUserItem(userId, [roll.item], roll.coin),
    ]);

    res.status(200).json({
      msg: "success",
      userItem: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Server error!",
      error,
    });
  }
};

exports.create = async (req, res, next) => {
  const { day, coin, item } = req.body;

  if (req.userData.roles != "admin") {
    return res.status(403).json({
      msg: "ValidatorError",
      errors: {
        user: `You don't have the permission!`,
      },
    });
  }

  let roll = {
    _id: mongoose.Types.ObjectId(),
    day,
    coin,
    item,
  };

  try {
    const itemRes = await Item.findById(item);
    itemRes
      ? itemRes.thumbnail
        ? (roll.thumbnail = itemRes.thumbnail)
        : ""
      : "";

    const rollObj = new Rollup(roll);

    const history = {
      type: "create",
      collection: "roll up",
      task: `Create a new roll up day: ${rollObj.day}`,
      date: new Date(),
      others: {
        id: rollObj._id,
      },
    };

    await rollObj.save();
    await User.updateOne(
      { _id: req.userData._id },
      {
        $push: {
          "history.manage": history,
        },
      }
    );

    res.status(201).json({
      msg: "success",
      roll: {
        _id: roll._id,
        day,
        coin,
        item,
        thumbnail: roll.thumbnail,
        request: {
          type: "GET",
          url: req.hostname + "/rolls/" + rollObj.day,
        },
      },
    });
  } catch (error) {
    console.log(error);
    let respond = {};
    error.errors &&
      Object.keys(error.errors).forEach(
        (err) => (respond[err] = error.errors[err].message)
      );
    res.status(202).json({
      msg: "ValidatorError",
      errors: respond,
    });
  }
};

exports.update = async (req, res, next) => {
  const { rollupDay } = req.params;

  if (req.userData.roles != "admin") {
    return res.status(403).json({
      msg: "ValidatorError",
      errors: {
        user: `You don't have the permission!`,
      },
    });
  }

  try {
    const objRoll = await Rollup.findOne({ day: rollupDay });
    for (const ops of req.body) {
      objRoll[ops.propName] = ops.value;

      if (ops.propName === "item") {
        const itemRes = await Item.findById(item);
        itemRes
          ? itemRes.thumbnail
            ? (objRoll.thumbnail = itemRes.thumbnail)
            : ""
          : "";
      }
    }

    const history = {
      type: "update",
      collection: "roll up",
      task: `Update a roll up day: ${objRoll.day}`,
      date: new Date(),
      others: {
        id: objRoll._id,
        fields: req.body.map((ele) => `${ele.propName}: ${ele.value}`),
      },
    };

    await objRoll.save();
    await User.updateOne(
      { _id: req.userData._id },
      {
        $push: {
          "history.manage": history,
        },
      }
    );

    res.status(200).json({
      msg: "success",
      roll: objRoll,
      request: {
        type: "GET",
        url: req.hostname + "/rolls/" + rollupDay,
      },
    });
  } catch (error) {
    console.log(error);
    let respond = {};
    error.errors &&
      Object.keys(error.errors).forEach(
        (err) => (respond[err] = error.errors[err].message)
      );
    res.status(202).json({
      msg: "ValidatorError",
      errors: respond,
    });
  }
};

exports.delete = async (req, res, next) => {
  const { rollupDay } = req.params;

  if (req.userData.roles != "admin") {
    return res.status(403).json({
      msg: "ValidatorError",
      errors: {
        user: `You don't have the permission!`,
      },
    });
  }

  try {
    const rollObj = await Rollup.findOne({ day: rollupDay });

    const history = {
      type: "delete",
      collection: "roll up",
      task: `Delete a roll up day: ${rollObj.day}`,
      date: new Date(),
      others: {
        id: rollObj._id,
      },
    };

    await Rollup.deleteOne({ day: rollupDay });
    await User.updateOne(
      { _id: req.userData._id },
      {
        $push: {
          "history.manage": history,
        },
      }
    );

    res.status(200).json({
      msg: "success",
      request: {
        type: "POST",
        url: req.hostname + "/rolls",
        body: {
          day: "Number",
          coin: "Number",
          item: "ObjectId",
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Server error!",
      error,
    });
  }
};
