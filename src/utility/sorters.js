export function sortByKey(array, key, direction = 'asc') {
  const modifier = direction === 'desc' ? -1 : 1;

  return [...array].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    // 1. Push null or undefined to the end
    if (valA == null && valB == null) return 0;
    if (valA == null) return 1;
    if (valB == null) return -1;

    // 2. Strict numeric comparison (handles numbers AND numeric strings like "-10.5" or "42")
    const numA = Number(valA);
    const numB = Number(valB);
    if (!Number.isNaN(numA) && !Number.isNaN(numB) && typeof valA !== 'boolean' && typeof valB !== 'boolean') {
      return (numA - numB) * modifier;
    }

    // 3. Natural string comparison
    if (typeof valA === 'string' && typeof valB === 'string') {
      return valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' }) * modifier;
    }

    // 4. Fallback for Dates, booleans, etc.
    if (valA < valB) return -1 * modifier;
    if (valA > valB) return 1 * modifier;
    return 0;
  });
}