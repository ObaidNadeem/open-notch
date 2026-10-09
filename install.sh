#!/bin/sh
# Installs Open Notch, or updates it to the latest release:
#
#   curl -fsSL https://obaidnadeem.github.io/open-notch/install.sh | sh
#
# It replaces the app where it already is (the running copy first, then /Applications, then ~/Applications), keeps everything in
# ~/.notchy, checks the disk image against the checksum published with it, and reopens the app. `notchyctl update` runs this.
# OPEN_NOTCH_FORCE=1 reinstalls even when the latest is already there.
set -eu

REPO="ObaidNadeem/open-notch"
APP="Open Notch.app"

note() { printf '%s\n' "$*"; }
fail() { printf 'Open Notch: %s\n' "$*" >&2; exit 1; }

[ "$(uname -s)" = Darwin ] || fail "it runs on macOS only."

# The latest release's tag, from where GitHub redirects /releases/latest (no API, so no rate limit).
latest=$(curl -fsSI "https://github.com/$REPO/releases/latest" </dev/null | tr -d '\r' | awk 'tolower($1) == "location:" { print $2 }' | sed -n 's|.*/tag/v||p' | tail -n 1)
[ -n "$latest" ] || fail "could not reach GitHub to find the latest version."

# Where the app is now: the copy that is running, else the usual places.
dest=""
pid=$(pgrep -x Notchy 2>/dev/null | head -n 1 || true)
if [ -n "$pid" ]; then
	running=$(ps -o command= -p "$pid" | sed -n 's|/Contents/MacOS/Notchy.*||p')
	case "$running" in *"/$APP") dest="$running" ;; esac
fi
for dir in /Applications "$HOME/Applications"; do
	if [ -z "$dest" ] && [ -d "$dir/$APP" ]; then dest="$dir/$APP"; fi
done

current=""
if [ -n "$dest" ]; then current=$(defaults read "$dest/Contents/Info.plist" CFBundleShortVersionString 2>/dev/null || true); fi
if [ "$current" = "$latest" ] && [ "${OPEN_NOTCH_FORCE:-}" != 1 ]; then
	note "Open Notch $current is already the latest."
	exit 0
fi
[ -n "$dest" ] || dest="/Applications/$APP"
parent=$(dirname "$dest")
mkdir -p "$parent" 2>/dev/null || true
[ -w "$parent" ] || fail "can't write to $parent. Move Open Notch to ~/Applications, or run this from an admin account."

if [ -n "$current" ]; then note "Updating Open Notch $current → $latest"; else note "Installing Open Notch $latest"; fi

tmp=$(mktemp -d)
cleanup() { hdiutil detach -quiet "$tmp/mount" </dev/null 2>/dev/null || true; rm -rf "$tmp"; }
trap cleanup EXIT INT TERM

base="https://github.com/$REPO/releases/download/v$latest"
curl -fL --progress-bar -o "$tmp/Open-Notch.dmg" "$base/Open-Notch.dmg" </dev/null || fail "download failed."
curl -fsSL -o "$tmp/Open-Notch.dmg.sha256" "$base/Open-Notch.dmg.sha256" </dev/null || fail "could not get the checksum."
(cd "$tmp" && shasum -a 256 -c Open-Notch.dmg.sha256 >/dev/null 2>&1) || fail "the download does not match its published checksum; nothing was changed."

hdiutil attach -nobrowse -readonly -quiet -mountpoint "$tmp/mount" "$tmp/Open-Notch.dmg" </dev/null || fail "could not open the disk image."
[ -d "$tmp/mount/$APP" ] || fail "the disk image has no $APP."

# Copied beside the old app first, so a failed copy leaves the old one in place.
ditto "$tmp/mount/$APP" "$dest.new" || { rm -rf "$dest.new"; fail "could not copy the app to $parent."; }
pkill -x Notchy 2>/dev/null || true
sleep 1
rm -rf "$dest"
mv "$dest.new" "$dest"

# A second copy (one in /Applications, one in ~/Applications) would go on opening the old version from Spotlight or at login:
# it is updated too, the same way.
for dir in /Applications "$HOME/Applications"; do
	other="$dir/$APP"
	if [ "$other" != "$dest" ] && [ -d "$other" ] && [ -w "$dir" ]; then
		if ditto "$tmp/mount/$APP" "$other.new"; then
			rm -rf "$other"
			mv "$other.new" "$other"
			note "Also updated the copy in $dir."
		else
			rm -rf "$other.new"
		fi
	fi
done

# The command the agents' hooks call. The old name stays only where it already exists (hooks written by Agent Notch).
mkdir -p "$HOME/.local/bin"
ln -sf "$dest/Contents/MacOS/notchyctl" "$HOME/.local/bin/notchyctl"
if [ -L "$HOME/.local/bin/anotch" ]; then ln -sf "$dest/Contents/MacOS/notchyctl" "$HOME/.local/bin/anotch"; fi

open "$dest"
note "Open Notch $latest is installed in $parent. What's new: https://obaidnadeem.github.io/open-notch/changelog"
