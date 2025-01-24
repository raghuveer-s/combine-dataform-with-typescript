Object.defineProperty(exports, "__esModule", { value: true });
var globalConfig_1 = require("./includes/globalConfig");
var preops_1 = require("./includes/preops");
publish('daily_area_sales', (0, globalConfig_1.createIncrementalConfig)({
    partitionBy: 'DATE(d)',
    partitionExpirationDays: 7
}))
    .query(function (ctx) { return "SELECT\n  Location as location, \n  TIMESTAMP_TRUNC(Brew_Date, DAY) d, \n  SUM(Total_Sales) AS daily_location_sales\nFROM\n  ".concat(ctx.ref('brewery_partitioned_clustered'), "\nWHERE\n  TIMESTAMP_TRUNC(Brew_Date, DAY) >= timestamp_checkpoint\nGROUP BY\n  location, d"); })
    .preOps(function (ctx) { return preops_1.PreOps.createTimestampCheckpoint(ctx, {
    columnName: 'd',
    defaultDate: '2024-01-01'
}); });
