export type BettererExecutorSchema =
  | BettererExecutorSchemaBase
  | BettererExecutorSchemaCi
  | BettererExecutorSchemaWatch
  | BettererExecutorSchemaUpdate;

interface BettererExecutorSchemaBase {
  ci?: false;
  watch?: false;
  update?: false;
}

interface BettererExecutorSchemaCi {
  ci: true;
  watch?: false;
  update?: false;
}

interface BettererExecutorSchemaWatch {
  ci?: false;
  watch: true;
  update?: false;
}

interface BettererExecutorSchemaUpdate {
  ci?: false;
  watch?: false;
  update: true;
}
