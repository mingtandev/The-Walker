const Statistic = require("./../models/statistic");

// URL params:
// 1. /statistics?day=2020-11-25
// 2. /statistics?start_day=2020-11-25
// 3. /statistics?end_day=2020-11-25
// 4. /statistics?start_day=2020-11-14&end_day=2020-11-25

exports.get = async (req, res, next) => {
  const start_day = req.query.start_day || "2020-10-31";
  const end_day = req.query.end_day || new Date().toLocaleDateString("en-CA");
  const day = req.query.day;

  try {
    let result = null;

    let start = start_day;
    let end = end_day;

    if (day) {
      start = new Date(day);
      end = new Date(day);
    } else {
      start = new Date(start_day);
      end = new Date(end_day);
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    result = await Statistic.find({
      createdAt: {
        $gte: start,
        $lt: end,
      },
    });

    const statistics = result.reduce(
      (accumulator, currentValue) => {
        accumulator["newUsers"] += currentValue["newUsers"];
        accumulator["activeUsers"] += currentValue["activeUsers"];
        accumulator["soldItems"] += currentValue["soldItems"];
        accumulator["usedCodes"] += currentValue["usedCodes"];
        accumulator["blogs"] += currentValue["blogs"];
        accumulator["cash"] += currentValue["cash"];

        return accumulator;
      },
      {
        newUsers: 0,
        activeUsers: 0,
        soldItems: 0,
        usedCodes: 0,
        blogs: 0,
        cash: 0,
      }
    );

    const response = {
      msg: "success",
      statistics,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Server error!",
      error,
    });
  }
};

module.exports.getChartDate = async (req, res, next) => {
  try {
    let result = {
      per_day: {},
      per_week: {},
      per_month: {},
    };

    let start = new Date("2020-10-31");
    let end = new Date();
    const diffDays = parseInt((end - start) / (1000 * 60 * 60 * 24), 10);

    const step = 1;

    // Query all record
    const ret = await Statistic.find({}).sort({
      createdAt: "asc",
    });
    const retDate = ret.map((ele) => ele.createdAt.toLocaleDateString("en-CA"));

    // Init temp
    let record = [0, 0, 0, 0, 0, 0];

    for (let i = 0; i < diffDays; i += step) {
      const day = new Date(start.setDate(start.getDate() + 1));
      const index = retDate.indexOf(day.toLocaleDateString("en-CA"));

      if (index !== -1) {
        record = [
          ret[index].newUsers + record[0],
          ret[index].activeUsers + record[1],
          ret[index].soldItems + record[2],
          ret[index].usedCodes + record[3],
          ret[index].blogs + record[4],
          ret[index].cash + record[5],
        ];
      }

      // Add record
      result.per_day[day.toLocaleDateString("en-CA")] = record;

      if (i % 7 === 0) {
        result.per_week[day.toLocaleDateString("en-CA")] = record;
      }

      if (day.getDate() === 1) {
        result.per_month[day.toLocaleDateString("en-CA")] = record;
      }
    }

    const response = {
      msg: "success",
      result,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Server error!",
      error,
    });
  }
};
