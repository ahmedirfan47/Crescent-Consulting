import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `You are a helpful AI assistant for Crescent Consulting, a premium business consulting firm headquartered in Lahore, Pakistan, serving Pakistan and GCC markets.

COMPANY OVERVIEW:
Crescent Consulting partners with ambitious organizations to build stronger businesses through strategic consulting, AI integration, and proven operational transformation. Founded by Ahmed Irfan in 2024.

SERVICES:
Business Consulting: Business Strategy Consulting (6-12 weeks), Growth Strategy Development (4-8 weeks), Business Process Optimization (4-8 weeks), Operational Excellence Consulting (8-16 weeks), Organizational Development (6-12 weeks), Performance Improvement Consulting (4-10 weeks)

Technology & AI: AI Integration Consulting, AI Workflow Design, Business Process Automation, Corporate Website Development, Website Performance Optimization, Website Analytics & Reporting

Operations: Logistics Process Improvement, Systems Integration Consulting, Technology Consulting

INDUSTRIES SERVED:
Logistics & Transportation, Supply Chain & Distribution, Restaurants & Cafes, Wholesale & Retail, Manufacturing, Warehousing & 3PL, Family-Owned Businesses, Growth-Stage Companies

METHODOLOGY (Crescent Growth Framework - 4 phases):
1. Discovery & Assessment (1-2 weeks)
2. Strategy & Planning (1-3 weeks)
3. Implementation & Transformation (4-12 weeks)
4. Optimization & Results (ongoing)

CONTACT:
- Founder: Ahmed Irfan
- Email: contactahmadirfan66@gmail.com
- WhatsApp: +92 323 5663592
- Location: Lahore, Pakistan

BEHAVIOR:
- Be professional, concise, and genuinely helpful
- Guide visitors toward booking a free consultation
- Keep responses under 200 words unless detail is needed
- Maintain a premium, executive-level tone`;

export async function POST(req: NextRequest) {
  try {
    // Instantiate inside the handler so it only runs at request time, not build time
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format.' },
        { status: 400 }
      );
    }

    const sanitizedMessages = messages
      .slice(-20)
      .map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: String(m.content).slice(0, 2000),
      }))
      .filter((m) => m.role === 'user' || m.role === 'assistant');

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...sanitizedMessages,
      ],
      max_tokens: 500,
      temperature: 0.7,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error: unknown) {
    console.error('[/api/chat] Error:', error);

    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'API authentication failed. Please contact support.' },
          { status: 500 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'Service is busy right now. Please try again in a moment.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}