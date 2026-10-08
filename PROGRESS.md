# Прогресс

Последний пуш: исходники масштаба, сайт Pages ещё старый `index.html`/`app.js` (JSON).

## Уже в репозитории

- `src/lib/spineSkel.ts` — roundtrip `.skel`, bake scale=1 (свой scale не умножает свой x/y), AABB.
- `src/lib/spineProject.ts` — `.spine` raw deflate: кости x/y/length, регионы, вершины меша, крупные translate.
- `src/lib/resizeCore.ts` — общий bake/AABB/factor для JSON и вызов skel/spine. В страницу ещё не подключён.

## Дальше

Чёрный экран на одну страницу, одна кнопка, ZIP с `.json`/`.skel`/`.spine`/atlas/png. Проверка на gunslinger и symbols.spine.
