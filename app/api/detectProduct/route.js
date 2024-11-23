import { NextResponse } from 'next/server';
import amazonScraper from 'amazon-buddy';

export async function POST(req) {
  try {
    const name = await req.json();
    if (!name) {
      return NextResponse.json({ message: 'No transcription text provided' }, { status: 400 });
    }

    // Use amazon-buddy to search for products
    const results = await amazonScraper.products({
      keyword: name, // Trim whitespace from input
      number: 1, // Fetch only the top result
      country: 'IN', // Specify the country
    });

    // Check if results are available
    if (results.result && results.result.length > 0) {
      const product = results.result[0];
      console.log(product);

      return NextResponse.json({
        title: product.title || 'No title available',
        price: product.price?.current_price || 'Unavailable',
        thumbnail: product.thumbnail || 'No image available',
        link: product.url || 'No link available',
      });
    } else {
      return NextResponse.json(
        { message: 'No products found for the given query' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching products with amazon-buddy:', error.message);

    return NextResponse.json(
      { error: 'Failed to fetch product data. Please try again later.' },
      { status: 500 }
    );
  }
}
