#!/usr/bin/env bash
# Apply SQL migrations to your Supabase Postgres database.
# Requires: psql, and DATABASE_URL in the environment.
#
# Get URI: Supabase Dashboard → Project Settings → Database → Connection string → URI
# (use the "transaction" pooler or direct connection; include password).
#
# Usage:
#   export DATABASE_URL='postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres'
#   ./scripts/apply-migrations.sh
#
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

URL="${DATABASE_URL:-${SUPABASE_DB_URL:-}}"

if [[ -z "$URL" ]]; then
  echo "Error: Set DATABASE_URL or SUPABASE_DB_URL (Postgres connection URI from Supabase)." >&2
  echo "Example in .env: DATABASE_URL=postgresql://..." >&2
  exit 1
fi

run_sql() {
  local f="$1"
  echo "→ $f"
  psql "$URL" -v ON_ERROR_STOP=1 -f "$f"
}

run_sql "$ROOT/database_schema.sql"
run_sql "$ROOT/add_metadata_column.sql"
run_sql "$ROOT/migrate_legacy_tax_estimates.sql"
run_sql "$ROOT/auth_handle_new_user.sql"
run_sql "$ROOT/seed_cameroon_taxes.sql"

if [[ -f "$ROOT/sql/reload_postgrest_schema.sql" ]]; then
  run_sql "$ROOT/sql/reload_postgrest_schema.sql"
fi

echo "Done. All migration files applied."
