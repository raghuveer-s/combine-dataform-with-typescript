import { createIncrementalConfig, TableType } from '@includes/globalConfig';

describe('BigQuery Config Builder', () => {
  describe('createIncrementalConfig', () => {
    it('should create valid incremental config with all required properties', () => {
      const params = {
        partitionBy: 'DATE(timestamp_col)',
        partitionExpirationDays: 60
      };

      const config = createIncrementalConfig(params);

      expect(config).toMatchObject({
        type: TableType.INCREMENTAL,
        bigquery: {
          partitionBy: params.partitionBy,
          requirePartitionFilter: true,
          partitionExpirationDays: params.partitionExpirationDays
        },
        tags: ['daily']
      });
    });

    it('should throw error if partitionBy is missing', () => {
      // We can create proper error classes here
      expect(() => createIncrementalConfig({ partitionBy: '', partitionExpirationDays: 10 }))
        .toThrow('partitionBy and partitionExpiry is required for incremental tables');
    });
  });
}); 