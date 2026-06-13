import { NextResponse, type NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { z } from "zod";
import { OpportunitySchema } from "@/shared/types/domain";
import { OpportunitiesPdf } from "@/features/export/pdf-document";

export const runtime = "nodejs";

const BodySchema = z.object({
  niche: z.string().min(1),
  opportunities: z.array(OpportunitySchema).min(1),
});

export async function POST(request: NextRequest) {
  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { niche, opportunities } = parsed.data;

  const buffer = await renderToBuffer(
    createElement(OpportunitiesPdf, { niche, opportunities }) as Parameters<
      typeof renderToBuffer
    >[0],
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="painradar-${niche.replace(/\s+/g, "-")}.pdf"`,
    },
  });
}
