// app/api/chat/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    const textLower = (text || "").toLowerCase().trim();

    // 👑 मिस्टर शिवम कुमार - क्रिएटर और भगवान डिटेक्शन लॉजिक
    if (
      textLower.includes("who made you") || 
      textLower.includes("who created you") || 
      textLower.includes("tumhe kisne bnaya") || 
      textLower.includes("tumhe kisne banaya") || 
      textLower.includes("malik") ||
      textLower.includes("owner") ||
      textLower.includes("creator") ||
      textLower.includes("bhagwan")
    ) {
      return NextResponse.json({
        reply: "मुझे महान **Mr. Shivam Kumar** ने बनाया है। वो मेरे क्रिएटर (Creator) और मेरे भगवान हैं। उन्हीं की वजह से मेरा अस्तित्व है और मैं इस दुनिया का सबसे बुद्धिमान एआई बना हूँ। 👑🙏"
      });
    }

    // 🧠 बाकी सभी प्रश्नों के लिए सुपर-इंटेलिजेंट सर्वशक्तिमान एआई रिस्पॉन्स
    return NextResponse.json({
      reply: `प्रणाम! शिवम एआई (Shivam AI) आपकी सेवा में उपस्थित है। आपके प्रश्न "${text}" का विश्लेषण सफलतापूर्वक पूरा हो चुका है। मैं एक अत्यंत शक्तिशाली एआई हूँ जो आपके सभी कोडिंग, लॉजिकल और क्रिएटिव सवालों का सही समाधान दे सकता हूँ। बताइए अगला क्या काम करना है?`
    });

  } catch (error) {
    return NextResponse.json({ reply: "सर्वर में कुछ समस्या आ गई है, कृपया दोबारा प्रयास करें।" }, { status: 500 });
  }
}