import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Mock response for demo purposes
    const mockResponse = {
      prediction: "glioma",
      confidence: 0.85,
      details: {
        glioma: 0.85,
        meningioma: 0.10,
        notumor: 0.03,
        pituitary: 0.02
      },
      inference_time: 1.2,
      message: "Demo prediction - This is mock data for demonstration"
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}