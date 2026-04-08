import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
    const sb = getSupabase();
    const { data, error } = await sb.from('comunidad_reactions').select('*');
    
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Convert array to a record dictionary for O(1) lookup on frontend
    const dictionary: Record<string, any> = {};
    if (data) {
        data.forEach(row => {
            dictionary[row.slug] = row;
        });
    }
    
    return NextResponse.json({ data: dictionary });
}

export async function POST(request: Request) {
    const sb = getSupabase();
    try {
        const body = await request.json();
        const { slug, emoji } = body;
        
        if (!slug || !emoji) {
            return NextResponse.json({ error: "Missing slug or emoji" }, { status: 400 });
        }
        
        // Map exact UI emojis to the database RPC string
        let target = '';
        if (emoji === '❤️') target = 'love';
        if (emoji === '👍') target = 'like';
        if (emoji === '😂') target = 'laugh';
        
        if (!target) {
            return NextResponse.json({ error: "Invalid emoji" }, { status: 400 });
        }

        const { error } = await sb.rpc('increment_reaction', { target_slug: slug, reaction_type: target });
        
        if (error) {
            console.error("Supabase RPC Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        
        return NextResponse.json({ success: true });
    } catch(e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
