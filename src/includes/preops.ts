export interface TimestampCheckpointConfig {
  columnName?: string;
  defaultDate?: string;
}

export class PreOps {
  /**
   * Creates a timestamp checkpoint declaration for incremental tables
   * @param ctx - The table context from Dataform
   * @param config - Optional configuration for the checkpoint
   * @returns SQL string for timestamp checkpoint declaration
   */
  static createTimestampCheckpoint(
    ctx: ITableContext,
    config: TimestampCheckpointConfig = { columnName: 'timestamp', defaultDate: '2024-01-01' }
  ): string {
    return `
    DECLARE timestamp_checkpoint 
    DEFAULT (${ctx.when(
      ctx.incremental(),
      `SELECT MAX(d) FROM ${ctx.self()} WHERE ${config.columnName} IS NOT NULL`,
      `SELECT TIMESTAMP("${config.defaultDate}")`
    )})
    `;
  }
}
