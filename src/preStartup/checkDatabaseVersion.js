import doesDatabaseVersionMatch from "@reactioncommerce/db-version-check";
import { migrationsNamespace } from "../../migrations/migrationsNamespace.js";

const expectedVersion = 3;

/**
 * @summary Called before startup to check whether the database is at the right version
 * @param {Object} context Startup context
 * @returns {undefined}
 */
export default async function checkDatabaseVersion(context) {
  const setToExpectedIfMissing = async () => {
    const anyAccount = await context.collections.Accounts.findOne();
    const anyGroup = await context.collections.Groups.findOne();
    const anyAccountHasAdminUIShopIds = await context.collections.Accounts.findOne({
      adminUIShopIds: {
        $exists: true
      }
    });

    return anyAccountHasAdminUIShopIds || !anyAccount || !anyGroup;
  };

  const ok = await doesDatabaseVersionMatch({
    // `db` is a Db instance from the `mongodb` NPM package,
    // such as what is returned when you do `client.db()`
    db: context.app.db,
    // These must match one of the namespaces and versions
    // your package exports in the `migrations` named export
    expectedVersion,
    namespace: migrationsNamespace,
    setToExpectedIfMissing
  });

  if (!ok) {
    throw new Error(`Database needs migrating. The "${migrationsNamespace}" namespace must be at version ${expectedVersion}. See docs for more information on migrations: https://github.com/reactioncommerce/api-migrations`);
  }
}
