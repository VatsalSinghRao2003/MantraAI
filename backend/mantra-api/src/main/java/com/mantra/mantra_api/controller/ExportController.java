package com.mantra.mantra_api.controller;

import com.mantra.mantra_api.entity.PromptHistory;
import com.mantra.mantra_api.repository.PromptHistoryRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/export")
public class ExportController {

    private final PromptHistoryRepository historyRepository;

    public ExportController(PromptHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    @GetMapping("/pdf/{id}")
    public ResponseEntity<byte[]> exportToPdf(@PathVariable Long id) {
        Optional<PromptHistory> opt = historyRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        PromptHistory prompt = opt.get();

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                // Header Title
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 18);
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText("MANTRA AI - PROMPT EXPORT REPORT");
                contentStream.endText();

                // Category & Score
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                contentStream.newLineAtOffset(50, 720);
                contentStream.showText("Category: " + prompt.getCategory() + "   |   Quality Score: " + prompt.getScore() + "/100");
                contentStream.endText();

                // Model Used
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                contentStream.newLineAtOffset(50, 700);
                contentStream.showText("Model: " + (prompt.getModel() != null ? prompt.getModel() : "Default Model") + "   |   Date: " + prompt.getCreatedAt().toString());
                contentStream.endText();

                // Original Prompt
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                contentStream.newLineAtOffset(50, 660);
                contentStream.showText("ORIGINAL PROMPT:");
                contentStream.endText();

                float currentY = drawMultilineText(contentStream, prompt.getOriginalPrompt(), 50, 640, 500, 10);

                // Optimized Prompt
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                contentStream.newLineAtOffset(50, currentY - 30);
                contentStream.showText("OPTIMIZED PROMPT:");
                contentStream.endText();

                drawMultilineText(contentStream, prompt.getOptimizedPrompt(), 50, currentY - 50, 500, 10);
            }

            document.save(out);
            byte[] bytes = out.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "prompt-export-" + id + ".pdf");
            return new ResponseEntity<>(bytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/docx/{id}")
    public ResponseEntity<byte[]> exportToDocx(@PathVariable Long id) {
        Optional<PromptHistory> opt = historyRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        PromptHistory prompt = opt.get();

        try (XWPFDocument document = new XWPFDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Title
            XWPFParagraph titlePara = document.createParagraph();
            XWPFRun titleRun = titlePara.createRun();
            titleRun.setBold(true);
            titleRun.setFontSize(18);
            titleRun.setText("MANTRA AI - PROMPT EXPORT REPORT");

            // Meta Info
            XWPFParagraph metaPara = document.createParagraph();
            XWPFRun metaRun = metaPara.createRun();
            metaRun.setFontSize(11);
            metaRun.setText("Category: " + prompt.getCategory() + "   |   Quality Score: " + prompt.getScore() + "/100\n");
            metaRun.setText("Model: " + (prompt.getModel() != null ? prompt.getModel() : "Default Model") + "   |   Date: " + prompt.getCreatedAt().toString());

            // Original Prompt Section
            XWPFParagraph origHeader = document.createParagraph();
            XWPFRun origHeaderRun = origHeader.createRun();
            origHeaderRun.setBold(true);
            origHeaderRun.setFontSize(12);
            origHeaderRun.setText("Original Prompt:");

            XWPFParagraph origBody = document.createParagraph();
            XWPFRun origBodyRun = origBody.createRun();
            origBodyRun.setFontSize(10);
            origBodyRun.setText(prompt.getOriginalPrompt());

            // Optimized Prompt Section
            XWPFParagraph optHeader = document.createParagraph();
            XWPFRun optHeaderRun = optHeader.createRun();
            optHeaderRun.setBold(true);
            optHeaderRun.setFontSize(12);
            optHeaderRun.setText("Optimized Prompt:");

            XWPFParagraph optBody = document.createParagraph();
            XWPFRun optBodyRun = optBody.createRun();
            optBodyRun.setFontSize(10);
            optBodyRun.setText(prompt.getOptimizedPrompt());

            document.write(out);
            byte[] bytes = out.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "prompt-export-" + id + ".docx");
            return new ResponseEntity<>(bytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private float drawMultilineText(PDPageContentStream contentStream, String text, float x, float y, float width, int fontSize) throws IOException {
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), fontSize);
        float leading = 1.5f * fontSize;
        List<String> lines = new ArrayList<>();
        
        // Split text by newlines first
        String[] paragraphs = text.split("\n");
        for (String para : paragraphs) {
            String[] words = para.split(" ");
            StringBuilder line = new StringBuilder();
            for (String word : words) {
                // Approximate word width (Helvetica averages 0.6f of font size per character)
                float estimateWidth = (line.length() + word.length() + 1) * fontSize * 0.6f;
                if (estimateWidth > width) {
                    lines.add(line.toString());
                    line = new StringBuilder(word).append(" ");
                } else {
                    line.append(word).append(" ");
                }
            }
            lines.add(line.toString());
        }

        float currentY = y;
        for (String line : lines) {
            if (currentY < 50) {
                // Keep rendering inside margins (simplified bounds check)
                break;
            }
            contentStream.beginText();
            contentStream.newLineAtOffset(x, currentY);
            // Replace non-ascii characters
            String cleanText = line.replaceAll("[^\\x20-\\x7E]", "");
            contentStream.showText(cleanText);
            contentStream.endText();
            currentY -= leading;
        }
        return currentY;
    }
}
