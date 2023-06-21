export type BettererExecutorSchema =
  | BettererExecutorSchemaBase
  | BettererExecutorSchemaCi
  | BettererExecutorSchemaWatch
  | BettererExecutorSchemaUpdate;

interface BettererExecutorSchemaBase {
  watch?: false;
  update?: false;
}

interface BettererExecutorSchemaWatch {
  watch: true;
  update?: false;
}

interface BettererExecutorSchemaUpdate {
  watch?: false;
  update: true;
}
