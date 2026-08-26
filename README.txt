ARHJ TRAVEL BLOG — PHASE 8.2 BUILD FIX

This patch fixes the Astro check errors shown after running npm run build:
- LanguageAvailability.astro parser/type errors
- ZodIssueCode deprecation hints
- SEOHead JSON-LD inline-script hint

HOW TO APPLY ON WINDOWS
1. Stop the dev server if it is running (press Ctrl+C).
2. Extract this ZIP.
3. Open the extracted patch folder.
4. Press Ctrl+A, then Ctrl+C.
5. Open your project folder: E:\Arhj Sardar Hojaifa\blog
6. Press Ctrl+V.
7. When Windows asks, choose "Replace the files in the destination".
8. Do NOT delete node_modules or package-lock.json.
9. Open CMD in E:\Arhj Sardar Hojaifa\blog.
10. Run: npm run qa:launch
11. Run: npm run build

If build succeeds, continue with Git/GitHub deployment.
