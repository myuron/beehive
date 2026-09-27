#!/usr/bin/env bash
set -uo pipefail

changed_file="$(jq -r '.tool_input.file_path // empty')"

case "$changed_file" in
  *.ts|*.tsx)
    cd "$CLAUDE_PROJECT_DIR" || exit 0
    # 変更ファイルの lint と、そのファイルに依存するテストだけを実行する
    if ! {
      pnpm exec oxlint "$changed_file" &&
        pnpm exec vitest related --run --passWithNoTests "$changed_file"
    } >&2; then
      exit 2 # stderr を Claude にフィードバック
    fi
    ;;
esac
exit 0
