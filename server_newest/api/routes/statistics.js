const express = require("express");

const StatisticController = require("../controllers/statistics");

const router = express.Router();

router.get("/", StatisticController.get);

router.get("/chart-data", StatisticController.getChartDate);

module.exports = router;
