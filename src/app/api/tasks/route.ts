import { corsHeaders } from "@/lib";
import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    const defaultUserId = "00a717b2-3e60-47be-9ea1-7797fb158efc";
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("userId", defaultUserId);
    return await NextResponse.json(
      { status: 200, data: data },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("userId", userId);

  if (error) {
    return NextResponse.json({
      status: 500,
      message: "エラーが発生しました。",
    });
  }

  return await NextResponse.json(
    { status: 200, data: data },
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("X-API-KEY");
  if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
    return NextResponse.json({ status: 401, message: "APIキーが無効です。" });
  }

  const body = await req.json();
  const { userId , title, description, completed, dueDate, priority } = body;
  const targetUserId = userId || "00a717b2-3e60-47be-9ea1-7797fb158efc";

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      userId: targetUserId,
      title,
      description,
      completed,
      dueDate,
      priority,
    })
    .select();
    console.log(error);
  if (error) {
    return NextResponse.json({
      status: 500,
      message: "エラーが発生しました。",
    });
  }

  return await NextResponse.json(
    { status: 200, data: data },
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}

/**
 * fetch のプリフライトリクエストに対応するための OPTIONS メソッド
 * @returns
 */
export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: corsHeaders,
  });
}
