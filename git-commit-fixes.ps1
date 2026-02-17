Set-Location C:\dev\bursar
git add docs/
git commit -m "Fix red headline and form alignment issues

Critical fixes based on visual QA:

1. Compliance variant headline - removed red color
   - Was: color: var(--red) (too aggressive/fear-mongering)  
   - Now: color: var(--primary) (professional dark)
   - Maintains large size for impact without looking unprofessional

2. Hero CTA form alignment  
   - Added align-items: stretch to .cta-box
   - Added height: auto to input and button for equal height
   - Better visual alignment of form elements
   - Consistent spacing using --space-2 variable

These address asymmetrical layout and overly aggressive red text."
git push origin main
Write-Output "Committed and pushed successfully"
