const Statistic = require("../models/statistic");

exports.saveStatistic = async (
  newUser,
  activeUser,
  soldItem,
  usedCode,
  blog,
  cash
) => {
  let start = new Date();
  start.setHours(0, 0, 0, 0);

  let end = new Date();
  end.setHours(23, 59, 59, 999);

  try {
    const todaySta = await Statistic.findOne({
      createdAt: {
        $gte: start,
        $lt: end,
      },
    });

    if (todaySta) {
      todaySta["newUsers"] += newUser;
      todaySta["activeUsers"] += activeUser;
      todaySta["soldItems"] += soldItem;
      todaySta["usedCodes"] += usedCode;
      todaySta["blogs"] += blog;
      todaySta["cash"] += cash;

      await todaySta.save();
    } else {
      const newSta = new Statistic({
        newUsers: newUser,
        activeUsers: activeUser,
        soldItems: soldItem,
        usedCodes: usedCode,
        blogs: blog,
        cash,
      });

      return await newSta.save();
    }
  } catch (error) {
    console.log(error);
    return error.message;
  }
};
