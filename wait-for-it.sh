#!/usr/bin/env sh
# wait-for-it.sh

set -e

host="$1"
shift
cmd="$@"

until pg_isready -h "$host" -p 5432; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec $cmd