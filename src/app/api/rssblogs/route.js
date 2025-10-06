// Mock RSS blogs for demo purposes
export async function GET() {
  try {
    const mockArticles = [
      {
        id: 1,
        title: "Understanding Brain Tumor Detection with AI",
        excerpt: "Learn how artificial intelligence is revolutionizing medical imaging and brain tumor detection.",
        date: new Date().toISOString(),
        author: "Medical AI Research",
        link: "#"
      },
      {
        id: 2,
        title: "Deep Learning in Healthcare: A Comprehensive Guide",
        excerpt: "Explore the applications of deep learning in modern healthcare and medical diagnosis.",
        date: new Date(Date.now() - 86400000).toISOString(),
        author: "Healthcare Tech",
        link: "#"
      },
      {
        id: 3,
        title: "MRI Image Processing Techniques",
        excerpt: "Advanced techniques for processing and analyzing MRI images for medical diagnosis.",
        date: new Date(Date.now() - 172800000).toISOString(),
        author: "Medical Imaging Expert",
        link: "#"
      }
    ];

    return Response.json({ articles: mockArticles });
  } catch (error) {
    console.error("RSS fetch error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch articles" }), { status: 500 });
  }
}
