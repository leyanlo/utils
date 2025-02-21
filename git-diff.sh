#!/bin/bash

show_help() {
  echo "Inspired by arc diff"
  echo "Usage: $0 <commit> <flags>"
  echo ""
  echo "Arguments:"
  echo " <commit> (optional) Start of the commit range, e.g. HEAD~"
  echo " <flags> (optional) Flags to pass to git push, e.g. -f"
  echo ""
  echo "This script cherry-picks a range of commits onto the upstream branch and pushes to origin."
}

if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
  show_help
  exit 0
fi

read -pr "Remote ref: " remote_ref

upstream=$(git rev-parse --abbrev-ref --symbolic-full-name "@{u}" 2>/dev/null)
head=$(git rev-parse HEAD 2>/dev/null)
curr_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)

if [ -z "$upstream" ] || [ -z "$head" ] || [ -z "$curr_branch" ]; then
  echo "Error: Unable to determine git branch information."
  exit 1
fi

commit="${1:-$upstream}"
flags="$2"

reset() {
  echo "git checkout \"$curr_branch\""
  git checkout "$curr_branch"
  exit "${1:-0}"
}

echo "git checkout \"$upstream\""
git checkout "$upstream" || reset 1
echo "git cherry-pick \"$commit\"..\"$head\""
git cherry-pick "$commit".."$head" || reset 1
if [ -n "$flags" ]; then
  echo "git push origin HEAD:refs/heads/\"$remote_ref\" \"$flags\""
  git push origin HEAD:refs/heads/"$remote_ref" "$flags" || reset 1
else
  echo "git push origin HEAD:refs/heads/\"$remote_ref\""
  git push origin HEAD:refs/heads/"$remote_ref" || reset 1
fi
reset
