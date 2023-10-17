/**
 * Valid modes for betterer to run as.
 */
export type BettererExecutorSchema =
  | BettererExecutorSchemaBase
  | BettererExecutorSchemaWatch
  | BettererExecutorSchemaUpdate
  | BettererExecutorSchemaPrecommit;

interface BettererExecutorSchemaBase {
  watch?: false;
  update?: false;
  precommit?: false;
}

interface BettererExecutorSchemaWatch {
  watch: true;
  update?: false;
  precommit?: false;
}

interface BettererExecutorSchemaUpdate {
  watch?: false;
  update: true;
  precommit?: false;
}

interface BettererExecutorSchemaPrecommit {
  watch?: false;
  update?: false;
  precommit: true;
}
