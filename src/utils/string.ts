/**
 * Adds newlines before Roman numeral list items in a paragraph
 * Supports both uppercase (I, II, III) and lowercase (i, ii, iii) Roman numerals
 * Handles various formatting patterns like "i.", "I)", "(i)", etc.
 */
function formatRomanNumeralList(paragraph: string): string {
  // Roman numeral patterns (supports 1-20 for practical use)
  const romanNumerals = {
    uppercase: [
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
      "XI",
      "XII",
      "XIII",
      "XIV",
      "XV",
      "XVI",
      "XVII",
      "XVIII",
      "XIX",
      "XX",
    ],
    lowercase: [
      "i",
      "ii",
      "iii",
      "iv",
      "v",
      "vi",
      "vii",
      "viii",
      "ix",
      "x",
      "xi",
      "xii",
      "xiii",
      "xiv",
      "xv",
      "xvi",
      "xvii",
      "xviii",
      "xix",
      "xx",
    ],
  };

  // Create regex pattern for all Roman numerals
  const allRomanNumerals = [
    ...romanNumerals.uppercase,
    ...romanNumerals.lowercase,
  ];
  const romanPattern = allRomanNumerals.join("|");

  // Pattern explanation:
  // (?<!\n) - Negative lookbehind: not already preceded by newline
  // \s* - Optional whitespace before numeral
  // (I|II|III|...) - Roman numeral capture group
  // [\.\)\]\}\>] - Common punctuation after numerals: . ) ] } >
  // |\([IVXLCDM]+\) - Alternative: parentheses around numeral (i)
  // \s+ - Required whitespace after punctuation
  // (?=\S) - Positive lookahead: followed by non-whitespace (actual content)

  const regex = new RegExp(
    `(?<!\\n)\\s*(${romanPattern})([\\.)\\]\\}\\>](?=\\s))\\s*(?=\\S)`,
    "gi"
  );

  // Also handle parenthetical Roman numerals like (i), (ii), etc.
  const parenthetical = new RegExp(
    `(?<!\\n)\\s*\\((${romanPattern})\\)\\s*(?=\\S)`,
    "gi"
  );

  // Apply transformations
  let result = paragraph;

  // Handle regular Roman numerals (i., ii., I), II), etc.)
  result = result.replace(regex, (match, numeral, punctuation) => {
    return `\n${numeral}${punctuation} `;
  });

  // Handle parenthetical Roman numerals ((i), (ii), etc.)
  result = result.replace(parenthetical, (match, numeral) => {
    return `\n(${numeral}) `;
  });

  // Clean up: remove any leading newlines and normalize spacing
  return result.replace(/^\n+/, "").replace(/\n\s*\n/g, "\n");
}

/**
 * Alternative implementation with more explicit Roman numeral validation
 * This version is more strict about what constitutes a valid Roman numeral
 */
function formatRomanNumeralListStrict(paragraph: string): string {
  // More comprehensive Roman numeral validation
  const isValidRomanNumeral = (str: string): boolean => {
    const romanRegex =
      /^(?=[MDCLXVI])M{0,4}(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/i;
    return romanRegex.test(str);
  };

  // Find potential Roman numerals followed by punctuation
  const pattern = /(?<![\n])\s*([MDCLXVI]+)([\.)\]\}]|\s*(?=\s))/gi;

  return paragraph.replace(pattern, (match, numeral, punctuation) => {
    if (isValidRomanNumeral(numeral)) {
      return `\n${numeral}${punctuation} `;
    }
    return match; // Return unchanged if not a valid Roman numeral
  });
}

/**
 * Enhanced version that handles edge cases and provides options
 */
interface FormatOptions {
  preserveExistingNewlines?: boolean;
  caseSensitive?: boolean;
  maxNumeralValue?: number; // Maximum Roman numeral to recognize (default: 20)
}

function formatRomanNumeralListAdvanced(
  paragraph: string,
  options: FormatOptions = {}
): string {
  const {
    preserveExistingNewlines = true,
    caseSensitive = false,
    maxNumeralValue = 20,
  } = options;

  // Generate Roman numerals up to maxNumeralValue
  const generateRomanNumerals = (max: number): string[] => {
    const numerals: string[] = [];
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = [
      "M",
      "CM",
      "D",
      "CD",
      "C",
      "XC",
      "L",
      "XL",
      "X",
      "IX",
      "V",
      "IV",
      "I",
    ];

    for (let num = 1; num <= max; num++) {
      let result = "";
      let remaining = num;

      for (let i = 0; i < values.length; i++) {
        while (remaining >= values[i]) {
          result += symbols[i];
          remaining -= values[i];
        }
      }
      numerals.push(result);
    }
    return numerals;
  };

  const romanNumerals = generateRomanNumerals(maxNumeralValue);
  const pattern = caseSensitive
    ? romanNumerals.join("|")
    : [...romanNumerals, ...romanNumerals.map((r) => r.toLowerCase())].join(
        "|"
      );

  const flags = caseSensitive ? "g" : "gi";
  const regex = new RegExp(
    `(?<!\\n)\\s*(${pattern})([\\.)\\]\\}]|\\s*(?=\\s))\\s*(?=\\S)`,
    flags
  );

  let result = paragraph.replace(regex, (match, numeral, punctuation) => {
    return `\n${numeral}${punctuation} `;
  });

  // Handle parenthetical format
  const parentheticalRegex = new RegExp(
    `(?<!\\n)\\s*\\((${pattern})\\)\\s*(?=\\S)`,
    flags
  );

  result = result.replace(parentheticalRegex, (match, numeral) => {
    return `\n(${numeral}) `;
  });

  if (!preserveExistingNewlines) {
    result = result.replace(/\n+/g, "\n");
  }

  return result.replace(/^\n+/, "");
}

export {
  formatRomanNumeralList,
  formatRomanNumeralListAdvanced,
  formatRomanNumeralListStrict,
};

export function merge(a?: string, ...b: (string | undefined)[]) {
  a = a ?? "";

  const c = b?.map((q) => q ?? "").join(" ") ?? "";
  return [a.trim(), c.trim()].join(" ").trim();
}
