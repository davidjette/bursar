@echo off
cd C:\dev\bursar
git add docs/
git commit -m "Replace trust badge emoji with professional SVG icons

All 3 variants (main, platform, compliance):
- Replaced 4 emoji (🏛️🔒📋⚖️) with Heroicons SVG
- Icons: building (Davis-Stirling), lock (encryption), clipboard (contracts), scales (attorney)
- Added CSS styling for trust badge SVG icons (20px, accent color, flex-shrink)
- Applied spacing scale variables for consistency

This completes emoji removal across all landing pages."
git push origin main
