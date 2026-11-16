package com.choson.sweet.shared;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;

import com.choson.sweet.domain.clients.Client;
import com.choson.sweet.domain.invoice_settings.InvoiceSettings;
import com.choson.sweet.domain.invoices.Invoice;
import com.choson.sweet.domain.invoices.InvoiceItem;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import jakarta.annotation.PostConstruct;

@Service
public class PdfGenerationService {

    private static final String FONT_NAME = "Arial";

    @PostConstruct
    public void init() {
        if (!FontFactory.isRegistered(FONT_NAME)) {
            try {
                FontFactory.register("c:/windows/fonts/arial.ttf", FONT_NAME);
                FontFactory.register("c:/windows/fonts/arialbd.ttf", FONT_NAME);
            } catch (Exception e) {
            }
        }
    }

    private Font font(String style, float size, int styleCode) {
        try {
            return FontFactory.getFont(FONT_NAME, BaseFont.IDENTITY_H, BaseFont.EMBEDDED, size, styleCode);
        } catch (Exception e) {
            return FontFactory.getFont(FontFactory.HELVETICA, size, styleCode);
        }
    }

    public byte[] generateInvoicePdf(Invoice invoice, Client client, InvoiceSettings settings) {
        Document document = new Document();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = font(FONT_NAME, 18, Font.BOLD);
            Font headerFont = font(FONT_NAME, 9, Font.BOLD);
            Font normalFont = font(FONT_NAME, 9, Font.NORMAL);
            Font smallBold = font(FONT_NAME, 8, Font.BOLD);
            Font smallNormal = font(FONT_NAME, 8, Font.NORMAL);

            Paragraph title = new Paragraph("ФАКТУРА", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(2);
            document.add(title);

            Paragraph invNum = new Paragraph("№ " + invoice.invoiceNumber, normalFont);
            invNum.setAlignment(Element.ALIGN_CENTER);
            invNum.setSpacingAfter(10);
            document.add(invNum);

            String dateStr = invoice.createdAt != null
                    ? LocalDateTime.parse(invoice.createdAt).format(DateTimeFormatter.ofPattern("dd.MM.yyyy"))
                    : "—";
            Paragraph issueDate = new Paragraph("Дата на издаване: " + dateStr, smallNormal);
            issueDate.setAlignment(Element.ALIGN_LEFT);
            issueDate.setSpacingBefore(0);
            document.add(issueDate);
            Paragraph taxEvent = new Paragraph("Данъчно събитие: " + dateStr, smallNormal);
            taxEvent.setAlignment(Element.ALIGN_LEFT);
            taxEvent.setSpacingBefore(0);
            document.add(taxEvent);
            // String dueDateStr = invoice.dueDate != null ? invoice.dueDate : dateStr; // TODO: due-date
            // Paragraph dueDatePara = new Paragraph("Падежна дата: " + dueDateStr, smallNormal);
            // dueDatePara.setAlignment(Element.ALIGN_LEFT);
            // dueDatePara.setSpacingBefore(0);
            // dueDatePara.setSpacingAfter(8);
            // document.add(dueDatePara);

            float col1 = 280f;
            float col2 = 280f;
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setWidths(new float[] { col1, col2 });
            infoTable.setSpacingAfter(14);

            String supName = settings != null && settings.name != null ? settings.name : "—";
            String supAddress = settings != null && settings.address != null ? settings.address : "";
            String supEik = settings != null && settings.companyRegistrationNumber != null
                    ? settings.companyRegistrationNumber
                    : "";
            String supVat = settings != null && settings.vatNumber != null ? settings.vatNumber : "";
            String supPhone = settings != null && settings.phone != null ? settings.phone : "";
            String supMol = settings != null && settings.materiallyResponsiblePerson != null
                    ? settings.materiallyResponsiblePerson
                    : "";

            StringBuilder supBuilder = new StringBuilder();
            supBuilder.append("ДОСТАВЧИК:\n").append(supName);
            if (!supAddress.isEmpty())
                supBuilder.append("\n").append(supAddress);
            if (!supEik.isEmpty())
                supBuilder.append("\nЕИК: ").append(supEik);
            if (!supVat.isEmpty())
                supBuilder.append("\nДДС номер: ").append(supVat);
            if (!supPhone.isEmpty())
                supBuilder.append("\nТелефон: ").append(supPhone);
            if (!supMol.isEmpty())
                supBuilder.append("\nМОЛ: ").append(supMol);

            infoTable.addCell(createInfoCell(supBuilder.toString(), smallNormal, smallBold));

            String clName = client != null && client.name != null ? client.name : "—";
            String clAddress = client != null && client.address != null ? client.address : "";
            String clEik = client != null && client.companyRegistrationNumber != null ? client.companyRegistrationNumber
                    : "";
            String clVat = client != null && client.vatNumber != null ? client.vatNumber : "";
            String clPhone = client != null && client.phone != null ? client.phone : "";
            String clMol = client != null && client.materiallyResponsiblePerson != null
                    ? client.materiallyResponsiblePerson
                    : "";

            StringBuilder clBuilder = new StringBuilder();
            clBuilder.append("ПОЛУЧАТЕЛ:\n").append(clName);
            if (!clAddress.isEmpty())
                clBuilder.append("\n").append(clAddress);
            if (!clEik.isEmpty())
                clBuilder.append("\nЕИК: ").append(clEik);
            if (!clVat.isEmpty())
                clBuilder.append("\nДДС номер: ").append(clVat);
            if (!clPhone.isEmpty())
                clBuilder.append("\nТелефон: ").append(clPhone);
            if (!clMol.isEmpty())
                clBuilder.append("\nМОЛ: ").append(clMol);

            infoTable.addCell(createInfoCell(clBuilder.toString(), smallNormal, smallBold));
            document.add(infoTable);

            double taxRate = (client != null && client.taxRate != null) ? client.taxRate : 20.0;
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 3f, 0.8f, 0.8f, 1.2f, 1.2f, 1.2f });

            Font thf = font(FONT_NAME, 8, Font.BOLD);
            java.awt.Color headerBg = new java.awt.Color(89, 89, 89);
            java.awt.Color white = java.awt.Color.WHITE;

            String[] headers = { "НАИМЕНОВАНИЕ", "МЯРКА", "КОЛИЧЕСТВО", "ЦЕНА", "ДДС", "ОБЩО" };
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, thf));
                cell.setBackgroundColor(headerBg);
                cell.setPadding(5);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setBorderColor(new java.awt.Color(127, 127, 127));
                cell.setPhrase(new Phrase(h, font(FONT_NAME, 8, Font.BOLD)));
                cell.getPhrase().getFont().setColor(white);
                table.addCell(cell);
            }

            List<InvoiceItem> items = invoice.items;
            for (InvoiceItem item : items) {
                double lineTotal = item.getLineTotal();
                double itemVat = lineTotal * taxRate / 100.0;
                String mu = item.measureUnits != null ? item.measureUnits : "бр.";
                table.addCell(createCell(item.productName, normalFont, Element.ALIGN_LEFT));
                table.addCell(createCell(mu, normalFont, Element.ALIGN_CENTER));
                table.addCell(createCell(formatInt(item.quantity), normalFont, Element.ALIGN_CENTER));
                table.addCell(createCell(String.format("%.2f", item.unitPrice), normalFont, Element.ALIGN_RIGHT));
                table.addCell(
                        createCell(String.format("%.2f (%.0f%%)", itemVat, taxRate), normalFont, Element.ALIGN_RIGHT));
                table.addCell(createCell(String.format("%.2f", lineTotal), normalFont, Element.ALIGN_RIGHT));
            }

            double subtotal = invoice.total;
            double totalVat = subtotal * taxRate / 100.0;
            double grandTotal = subtotal + totalVat;

            PdfPCell spacer = new PdfPCell(new Phrase(""));
            spacer.setBorder(Rectangle.NO_BORDER);
            spacer.setFixedHeight(8);
            spacer.setColspan(6);
            table.addCell(spacer);

            addTotalRow(table, "ОБЩО", String.format("%.2f", subtotal), normalFont);
            addTotalRow(table, "ДДС", String.format("%.2f", totalVat), normalFont);
            addTotalRow(table, "Сума за плащане", String.format("%.2f  (  %s BGN  )", grandTotal, amountInWords(grandTotal)), font(FONT_NAME, 10, Font.BOLD));

            document.add(table);

            String pt = invoice.paymentType != null ? invoice.paymentType : "bank_transfer";
            Paragraph paymentLabel = new Paragraph("Начин на плащане: " + paymentTypeLabelBg(pt), smallNormal);
            paymentLabel.setSpacingBefore(8);
            document.add(paymentLabel);

            if ("bank_transfer".equals(pt)) {
                StringBuilder bankInfo = new StringBuilder();
                bankInfo.append("Банка: ").append(invoice.bank != null && !invoice.bank.isBlank() ? invoice.bank : "");
                bankInfo.append("\nIBAN: ").append(invoice.iban != null && !invoice.iban.isBlank() ? invoice.iban : "");
                bankInfo.append("\nBIC: ").append(invoice.bic != null && !invoice.bic.isBlank() ? invoice.bic : "");
                Paragraph bankPara = new Paragraph(bankInfo.toString(), smallNormal);
                bankPara.setSpacingBefore(2);
                bankPara.setSpacingAfter(16);
                document.add(bankPara);
            } else {
                Paragraph bankSpacer = new Paragraph("", smallNormal);
                bankSpacer.setSpacingAfter(16);
                document.add(bankSpacer);
            }

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }

        return baos.toByteArray();
    }

    private PdfPCell createCell(String content, Font font, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(content, font));
        cell.setPadding(4);
        cell.setHorizontalAlignment(alignment);
        cell.setBorderColor(new java.awt.Color(127, 127, 127));
        return cell;
    }

    private PdfPCell createInfoCell(String content, Font normal, Font bold) {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(4);
        cell.setBorder(Rectangle.NO_BORDER);
        String[] lines = content.split("\n");
        for (int i = 0; i < lines.length; i++) {
            boolean isHeader = lines[i].endsWith(":") && lines[i].length() < 20;
            Font f = isHeader ? bold : normal;
            Phrase phrase = new Phrase(lines[i] + (i < lines.length - 1 ? "\n" : ""), f);
            cell.addElement(phrase);
        }
        return cell;
    }

    private void addTotalRow(PdfPTable table, String label, String value, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(label + ":  " + value, font));
        cell.setColspan(6);
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(4);
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(cell);
    }

    private String paymentTypeLabelBg(String type) {
        if ("bank_transfer".equals(type)) return "По сметка";
        return type;
    }

    private String formatInt(double d) {
        if (d == Math.floor(d)) {
            return String.valueOf((int) d);
        }
        return String.format("%.2f", d);
    }

    private String amountInWords(double amount) {
        long whole = (long) amount;
        int cents = (int) Math.round((amount - whole) * 100);
        String words = numberToWordsBg(whole);
        if (cents > 0) {
            words += " И " + cents + " СТОТИНКИ";
        }
        return words.toUpperCase();
    }

    private String numberToWordsBg(long n) {
        if (n == 0)
            return "НУЛА";
        String[] ones = { "", "ЕДИН", "ДВА", "ТРИ", "ЧЕТИРИ", "ПЕТ", "ШЕСТ", "СЕДЕМ", "ОСЕМ", "ДЕВЕТ" };
        String[] tens = { "", "ДЕСЕТ", "ДВАДЕСЕТ", "ТРИДЕСЕТ", "ЧЕТИРИДЕСЕТ", "ПЕТДЕСЕТ", "ШЕСТДЕСЕТ", "СЕДЕМДЕСЕТ",
                "ОСЕМДЕСЕТ", "ДЕВЕТДЕСЕТ" };
        String[] teens = { "ДЕСЕТ", "ЕДИНАДЕСЕТ", "ДВАНАДЕСЕТ", "ТРИНАДЕСЕТ", "ЧЕТИРИНАДЕСЕТ", "ПЕТНАДЕСЕТ",
                "ШЕСТНАДЕСЕТ", "СЕДЕМНАДЕСЕТ", "ОСЕМНАДЕСЕТ", "ДЕВЕТНАДЕСЕТ" };

        StringBuilder sb = new StringBuilder();

        if (n >= 1000) {
            long thousands = n / 1000;
            if (thousands == 1)
                sb.append("ХИЛЯДА");
            else {
                sb.append(numberToWordsBg(thousands)).append(" ХИЛЯДИ");
            }
            n %= 1000;
            if (n > 0)
                sb.append(" ");
        }

        if (n >= 100) {
            long hundreds = n / 100;
            if (hundreds == 1)
                sb.append("СТО");
            else
                sb.append(ones[(int) hundreds]).append(" СТОТИН");
            n %= 100;
            if (n > 0)
                sb.append(" ");
        }

        if (n >= 20) {
            long ten = n / 10;
            sb.append(tens[(int) ten]);
            n %= 10;
            if (n > 0)
                sb.append(" ");
        } else if (n >= 10) {
            sb.append(teens[(int) (n - 10)]);
            n = 0;
        }

        if (n > 0) {
            sb.append(ones[(int) n]);
        }

        return sb.toString();
    }
}
