import { createIncrementalConfig } from '@includes/globalConfig';
import { PreOps } from '@includes/preops';
import { glob } from 'glob';

publish('daily_area_sales', createIncrementalConfig({
  partitionBy: 'DATE(d)', 
  partitionExpirationDays: 7
}))
  .query(
    (ctx) => `SELECT
  Location as location, 
  TIMESTAMP_TRUNC(Brew_Date, DAY) d, 
  SUM(Total_Sales) AS daily_location_sales
FROM
  ${ctx.ref('brewery_partitioned_clustered')}
WHERE
  TIMESTAMP_TRUNC(Brew_Date, DAY) >= timestamp_checkpoint
GROUP BY
  location, d`
  )
  .preOps((ctx) => PreOps.createTimestampCheckpoint(ctx, {
    columnName: 'd',
    defaultDate: '2024-01-01'
  }));
