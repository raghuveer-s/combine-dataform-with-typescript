//declare global {
function declare(dataset: ITarget);
function assert(name: string, query?: Contextable);
function publish(
  name: string,
  queryOrConfig?: Contextable | ITableConfig
): Table;
function operate(name: string, queries?: Contextable);
//}

interface CommonContext {
  self: () => string;
  name: () => string;
  ref: (ref: Resolvable | string[], ...rest: string[]) => string;
  resolve: (ref: Resolvable | string[], ...rest: string[]) => string;
  schema: () => string;
  database: () => string;
};

type Contextable<Context, T> = T | ((ctx: Context) => T);

interface IActionConfig {
  tags?: string[];
  dependencies?: Resolvable | Resolvable[];
  disabled?: boolean;
};

interface IAssertionConfig
  extends ITargetableConfig,
    IDependenciesConfig {
  database?: string;
  schema?: string;
  description?: string;
};

interface IBigQueryOptions {
  partitionBy?: string;
  clusterBy?: string[];
  updatePartitionFilter?: string;
  labels?: { [name: string]: string };
  partitionExpirationDays?: number;
  requirePartitionFilter?: boolean;
  additionalOptions?: { [name: string]: string };
};

interface IColumnsDescriptor {
  [name: string]: string | IRecordDescriptor;
};

interface IDeclarationConfig
  extends IDocumentableConfig,
    ITargetableConfig {};

interface IDependenciesConfig {
  dependencies?: Resolvable | Resolvable[];
  hermetic?: boolean;
  dependOnDependencyAssertions?: boolean;
};

interface IDocumentableConfig {
  columns?: IColumnsDescriptor;
  description?: string;
};

interface INamedConfig {
  type?: string;
  name?: string;
};

interface IOperationConfig {
  columns: IColumnsDescriptor;
  database: string;
  description: string;
  disabled: boolean;
  hasOutput: boolean;
  hermetic: boolean;
  schema: string;
  tags: string[];
};

interface IProjectConfig {
  defaultDatabase: string;
  defaultSchema: string;
  defaultLocation: string;
  assertionSchema: string;
  vars: { [key: string]: string };
  databaseSuffix: string;
  schemaSuffix: string;
  tablePrefix: string;
  warehouse: string;
};

interface IRecordDescriptor {
  description?: string;
  columns?: IColumnsDescriptor;
  displayName?: string;
  tags?: string | string[];
  bigqueryPolicyTags?: string | string[];
};

interface ITableAssertions {
  nonNull?: string | string[];
  rowConditions: string[];
  uniqueKey: string | string[];
  uniqueKeys: [];
};

interface ITableConfig
  extends IActionConfig,
    IDependenciesConfig,
    IDocumentableConfig,
    INamedConfig,
    ITargetableConfig {
  assertions?: ITableAssertions;
  bigquery?: IBigQueryOptions;
  columns?: IColumnsDescriptor;
  database?: string;
  description?: string;
  disabled?: boolean;
  hermetic?: boolean;
  materialized?: boolean;
  protected?: boolean;
  schema?: string;
  tags?: string[];
  type: TableType;
  uniqueKey?: string | string[];
};

interface ITableContext extends CommonContext {
  when: (cond: boolean, trueCase: string, falseCase?: string) => string;
  incremental: () => boolean;
};

interface ITarget {
  database?: string;
  schema?: string;
  name?: string;
  includeDependentAssertions?: boolean;
};

interface ITargetableConfig {
  database?: string;
  schema?: string;
};

type Resolvable = string | ITarget;

interface Table {
  query(query: Contextable<ITableContext, string>): Table;
  where(where: Contextable<ITableContext, string>): Table;
  preOps(pres: Contextable<ITableContext, string | string[]>): Table;
  postOps(posts: Contextable<ITableContext, string | string[]>): Table;
};

