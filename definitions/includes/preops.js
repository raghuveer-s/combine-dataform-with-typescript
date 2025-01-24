Object.defineProperty(exports, "__esModule", { value: true });
exports.PreOps = undefined;
var PreOps = /** @class */ (function () {
    function PreOps() {
    }
    /**
     * Creates a timestamp checkpoint declaration for incremental tables
     * @param ctx - The table context from Dataform
     * @param config - Optional configuration for the checkpoint
     * @returns SQL string for timestamp checkpoint declaration
     */
    PreOps.createTimestampCheckpoint = function (ctx, config) {
        if (config === undefined) { config = { columnName: 'timestamp', defaultDate: '2024-01-01' }; }
        return "\n    DECLARE timestamp_checkpoint \n    DEFAULT (".concat(ctx.when(ctx.incremental(), "SELECT MAX(d) FROM ".concat(ctx.self(), " WHERE ").concat(config.columnName, " IS NOT NULL"), "SELECT TIMESTAMP(\"".concat(config.defaultDate, "\")")), ")\n    ");
    };
    return PreOps;
}());
exports.PreOps = PreOps;
