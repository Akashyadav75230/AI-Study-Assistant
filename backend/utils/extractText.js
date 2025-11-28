import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import AdmZip from "adm-zip";
import { XMLParser } from "fast-xml-parser";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { createRequire } from "module";
import { createWorker } from "tesseract.js";

const require = createRequire(import.meta.url);

// ✅ Disable fake workers (Node doesn’t support browser workers)
pdfjsLib.GlobalWorkerOptions.disableWorker = true;

// ✅ Fix: Set proper standard fonts directory (with trailing slash)
const standardFontPath = path
  .join(process.cwd(), "fonts", "standard_fonts")
  .replace(/\\/g, "/") + "/";


// ✅ OCR fallback (for scanned PDFs)
async function ocrImage(imageBuffer) {
  const worker = await createWorker();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  const { data } = await worker.recognize(imageBuffer);
  await worker.terminate();
  return data.text;
}

// ✅ PDF extractor with OCR fallback
async function extractPDF(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));

  // ✅ include standardFontDataUrl here to remove warning
  const pdf = await pdfjsLib
    .getDocument({ data, standardFontDataUrl: standardFontPath })
    .promise;

  let fullText = "";

  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const content = await page.getTextContent();
    let text = content.items.map((item) => item.str).join(" ").trim();

    // ✅ OCR fallback for image-based pages
    if (!text) {
      const viewport = page.getViewport({ scale: 2 });
      const canvasFactory = new pdfjsLib.NodeCanvasFactory();
      const { canvas, context } = canvasFactory.create(
        viewport.width,
        viewport.height
      );
      await page.render({ canvasContext: context, viewport }).promise;

      const img = canvas.toBuffer();
      text = await ocrImage(img);
    }

    fullText += text + "\n";
  }

  return fullText.trim();
}

// ✅ Master extractor
export async function extractText(filePath, mime, originalName) {
  const ext = (originalName || "").toLowerCase();

  try {
    // --- PDF ---
    if (ext.endsWith(".pdf")) return await extractPDF(filePath);

    // --- DOCX ---
    if (ext.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || "";
    }

    // --- PPTX ---
    if (ext.endsWith(".pptx")) {
      const zip = new AdmZip(filePath);
      const parser = new XMLParser();
      let text = "";

      zip.getEntries().forEach((entry) => {
        if (
          entry.entryName.includes("slide") &&
          entry.entryName.endsWith(".xml")
        ) {
          const data = parser.parse(entry.getData().toString());
          text += JSON.stringify(data) + "\n";
        }
      });

      return text;
    }

    // --- TXT or fallback ---
    return fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.error("ExtractText error:", err);
    return "";
  }
}

