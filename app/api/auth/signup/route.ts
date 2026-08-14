import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "همه فیلدها الزامی هستند" },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        { error: "نام باید حداقل ۲ کاراکتر باشد" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "رمز عبور باید حداقل ۸ کاراکتر باشد" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // name → user_metadata تا تریگر handle_new_user آن را در profiles بنویسد
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      const lower = error.message.toLowerCase();
      const msg =
        lower.includes("already registered") || lower.includes("already been registered")
          ? "این ایمیل قبلاً ثبت شده است"
          : lower.includes("password")
            ? "رمز عبور معتبر نیست"
            : error.message;

      return NextResponse.json({ error: msg }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید." },
        { status: 400 }
      );
    }

    // پروفایل توسط تریگر on_auth_user_created ساخته می‌شود — اینجا کاری نمی‌کنیم

    if (!data.session) {
      return NextResponse.json({
        success: true,
        needsConfirmation: true,
        message: "ثبت‌نام موفق بود. لطفاً ایمیل خود را تأیید کنید.",
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name ?? name,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "خطایی در سرور رخ داد" },
      { status: 500 }
    );
  }
}
