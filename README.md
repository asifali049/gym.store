# Phase 4 fixes — fake data cleanup

Copy each file below into your repo at the SAME path (overwrite the existing file).

1. apps/web/src/components/sections/bestsellers-tabs.tsx  → OVERWRITE
   Now pulls real categories + products from the API instead of 20 hardcoded fake products.

2. apps/web/src/components/auth/auth-hero.tsx  → OVERWRITE
   Removed the fake "50K+ Customers / 100K+ Orders / 4.9 Rating" stats block.

3. apps/web/src/app/cart/page.tsx  → OVERWRITE
   Replaced picsum.photos item image with an emoji placeholder (consistent with products/product pages).

4. apps/web/src/app/orders/[id]/page.tsx  → OVERWRITE
   Same picsum → emoji placeholder fix as cart page.

5. DELETE this file entirely (not included in zip, just delete it from your repo):
   apps/web/src/components/auth/auth-layout.tsx
   — It's dead code, not imported anywhere, and had the same fake-stats + picsum-photo issue.
     Deleting it removes the problem instead of fixing something nobody uses.
