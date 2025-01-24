Object.defineProperty(exports, "__esModule", { value: true });
exports.TableType = exports.createIncrementalConfig = undefined;
var TableType;
(function (TableType) {
    TableType["VIEW"] = "view";
    TableType["TABLE"] = "table";
    TableType["INCREMENTAL"] = "incremental";
})(TableType || (exports.TableType = TableType = {}));
var BigQueryConfigBuilder = /** @class */ (function () {
    function BigQueryConfigBuilder() {
        this.config = {
            requirePartitionFilter: true, // Default to true for safety
            partitionExpirationDays: 90 // Default expiration
        };
        this.tableType = TableType.INCREMENTAL;
    }
    /**
     * Creates an incremental config with required properties
     */
    BigQueryConfigBuilder.createIncrementalConfig = function (params) {
        var _a;
        if (!params.partitionBy || !params.partitionExpirationDays) {
            throw new Error('partitionBy and partitionExpiry is required for incremental tables');
        }
        return new BigQueryConfigBuilder()
            .withType(TableType.INCREMENTAL)
            .withPartitionBy(params.partitionBy)
            .withPartitionExpiry((_a = params.partitionExpirationDays) !== null && _a !== undefined ? _a : 90)
            .requirePartitionFilter()
            .build();
    };
    BigQueryConfigBuilder.prototype.withPartitionExpiry = function (days) {
        this.config.partitionExpirationDays = days;
        return this;
    };
    /**
     * Sets the table type
     */
    BigQueryConfigBuilder.prototype.withType = function (type) {
        this.tableType = type;
        return this;
    };
    /**
     * Sets the partitioning column
     */
    BigQueryConfigBuilder.prototype.withPartitionBy = function (column) {
        this.config.partitionBy = column;
        return this;
    };
    /**
     * Sets clustering columns
     */
    BigQueryConfigBuilder.prototype.withClusterBy = function (columns) {
        this.config.clusterBy = columns;
        return this;
    };
    /**
     * Requires partition filter
     */
    BigQueryConfigBuilder.prototype.requirePartitionFilter = function (require) {
        if (require === undefined) { require = true; }
        this.config.requirePartitionFilter = require;
        return this;
    };
    /**
     * Builds the final table config
     */
    BigQueryConfigBuilder.prototype.build = function () {
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
    };
    return BigQueryConfigBuilder;
}());
// Export the factory function
exports.createIncrementalConfig = BigQueryConfigBuilder.createIncrementalConfig;
