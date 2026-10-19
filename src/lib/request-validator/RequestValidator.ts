export type DescriptionMatch = {
  percentage: number;
  level: "high" | "medium" | "low";
};

function words(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean),
  );
}

function similarity(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 || right.size === 0) return 0;

  let sharedWords = 0;
  for (const word of left) {
    if (right.has(word)) sharedWords += 1;
  }

  return (2 * sharedWords) / (left.size + right.size);
}

export function validateRequestDescriptions(
  itemDescriptions: string[] = [],
  claimantDescriptions: string[] = [],
): DescriptionMatch {
  const itemWords = itemDescriptions
    .map(words)
    .filter((description) => description.size);
  const claimantWords = claimantDescriptions
    .map(words)
    .filter((description) => description.size);

  const percentage =
    itemWords.length === 0 || claimantWords.length === 0
      ? 0
      : Math.round(
          (itemWords.reduce((total, itemDescription) => {
            const bestMatch = Math.max(
              ...claimantWords.map((claimantDescription) =>
                similarity(itemDescription, claimantDescription),
              ),
            );
            return total + bestMatch;
          }, 0) /
            itemWords.length) *
            100,
        );

  return {
    percentage,
    level: percentage >= 70 ? "high" : percentage >= 45 ? "medium" : "low",
  };
}
