import nlp from "compromise";

// Function to extract product names from a paragraph
const extractProductsFromParagraph = (paragraph) => {
  if (!paragraph.trim()) {
    return [];
  }

  // Preprocess the paragraph: remove all occurrences of "The" or "the" from anywhere in the paragraph
  let normalizedParagraph = paragraph.trim();

  // Remove all instances of "The" or "the" from the entire string
  normalizedParagraph = normalizedParagraph.replace(/\b(the|The)\b/g, '');

  // Use Compromise to parse the input paragraph
  const doc = nlp(normalizedParagraph);

  // Extract nouns from the paragraph
  const nouns = doc.nouns().out('array');

  // Define stop words (common words that aren't likely to be product names)
  const stopWords = [
    "with", "and", "in", "on", "for", "at", "by", "a", "an", "of", "as", "that", "this", "to", "from", "is", "are", "was", "it", "we", "they", "don't", "has", "have", "i", "you", "he", "she", "they", "there"
  ];

  // Filter out stop words from the noun list by converting them to lowercase
  const filteredNouns = nouns.filter(word => !stopWords.includes(word.toLowerCase()));

  // Combine consecutive capitalized nouns or numbers into multi-word product names
  let result = [];
  for (let i = 0; i < filteredNouns.length; i++) {
    // Check if the current word contains at least one capital letter
    if (/[A-Z]/.test(filteredNouns[i])) {
      // Check if the next word also contains a capital letter, indicating a multi-word product name
      if (i + 1 < filteredNouns.length && /[A-Z]/.test(filteredNouns[i + 1])) {
        result.push(`${filteredNouns[i]} ${filteredNouns[i + 1]}`);
        i++; // Skip the next word as it's already combined
      } else {
        result.push(filteredNouns[i]);
      }
    }
  }

  // Remove duplicates and finalize the product list
  const uniqueProducts = [...new Set(result)];

  // Remove punctuation (commas, periods, etc.) from the end of each product name
  const cleanedProducts = uniqueProducts.map(product => product.replace(/[.,!?;]$/, ''));

  // Return the cleaned product names as an array
  return cleanedProducts;
};

export default extractProductsFromParagraph;
