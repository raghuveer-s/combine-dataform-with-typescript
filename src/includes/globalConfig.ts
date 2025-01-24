enum TableType {
  VIEW = 'view',
  TABLE = 'table',
  INCREMENTAL = 'incremental',
};

class BigQueryConfigBuilder {
  private config: IBigQueryOptions = {
    requirePartitionFilter: true, // Default to true for safety
    partitionExpirationDays: 90  // Default expiration
  };
  private tableType: TableType = TableType.INCREMENTAL;

  /**
   * Creates an incremental config with required properties
   */
  static createIncrementalConfig(params: {
    partitionBy: string;
    partitionExpirationDays: number;
  }): ITableConfig {
    if (!params.partitionBy || !params.partitionExpirationDays) {
      throw new Error('partitionBy and partitionExpiry is required for incremental tables');
    }

    return new BigQueryConfigBuilder()
      .withType(TableType.INCREMENTAL)
      .withPartitionBy(params.partitionBy)
      .withPartitionExpiry(params.partitionExpirationDays ?? 90)
      .requirePartitionFilter()
      .build();
  }

  private withPartitionExpiry(days: number): BigQueryConfigBuilder {
    this.config.partitionExpirationDays = days;
    return this;
  }

  /**
   * Sets the table type
   */
  withType(type: TableType): BigQueryConfigBuilder {
    this.tableType = type;
    return this;
  }

  /**
   * Sets the partitioning column
   */
  withPartitionBy(column: string): BigQueryConfigBuilder {
    this.config.partitionBy = column;
    return this;
  }

  /**
   * Sets clustering columns
   */
  withClusterBy(columns: string[]): BigQueryConfigBuilder {
    this.config.clusterBy = columns;
    return this;
  }

  /**
   * Requires partition filter
   */
  requirePartitionFilter(require: boolean = true): BigQueryConfigBuilder {
    this.config.requirePartitionFilter = require;
    return this;
  }

  /**
   * Builds the final table config
   */
  build(): ITableConfig {
    if (this.tableType === TableType.INCREMENTAL) {
      if (!this.config.partitionBy) {
        throw new Error('partitionBy is required for incremental tables');
      }
      if (!this.config.requirePartitionFilter) {
        throw new Error('requirePartitionFilter must be true for incremental tables');
      }
      if (!this.config.partitionExpirationDays) {
        throw new Error('partitionExpirationDays is required for incremental tables');
      }
    }

    return {
      type: this.tableType,
      bigquery: this.config,
      tags: ['daily']
    };
  }
}

// Export the factory function
export const createIncrementalConfig = BigQueryConfigBuilder.createIncrementalConfig;

// Export TableType enum and builder factory
export { TableType };
