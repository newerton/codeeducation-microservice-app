export function getGenresFromCategory(genres, category) {
  return genres.filter(
    genre => genre.categories.filter(cat => cat.id === category.id).length !== 0
  );
}
