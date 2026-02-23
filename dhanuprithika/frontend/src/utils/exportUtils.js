import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper to download table data as CSV
export const downloadCSV = (headers, rows, filename = 'export.csv') => {
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Helper to export specific HTML element (dashboard/chart views) to PDF
export const exportElementToPDF = async (elementId, filename = 'report.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0f172a' });
        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(filename);
    } catch (error) {
        console.error('Error exporting PDF', error);
    }
};
