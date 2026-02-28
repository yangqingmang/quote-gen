import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { serviceType, description } = await req.json()

    if (!serviceType || !description) {
      return NextResponse.json(
        { error: 'Service type and description are required' },
        { status: 400 }
      )
    }

    const prompt = `You are a professional tradesman creating a quote for a customer.

Service Type: ${serviceType}
Job Description: ${description}

Create a professional quote that includes:
1. A brief header with the service type
2. List of work to be done
3. Materials needed (with reasonable estimates)
4. Labor cost (use standard industry rates - $50-100/hr for skilled trades)
5. Total estimate

Format it professionally but keep it simple. Include a note that this is an estimate and final costs may vary.

Make it look like a real quote from a small business.`

    // MiniMax API call
    const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.5',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that creates professional service quotes.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`MiniMax API error: ${errorText}`)
    }

    const data = await response.json()
    const quote = data.choices?.[0]?.message?.content || 'Failed to generate quote'

    return NextResponse.json({ quote })
  } catch (error: unknown) {
    console.error('Error generating quote:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate quote' },
      { status: 500 }
    )
  }
}
