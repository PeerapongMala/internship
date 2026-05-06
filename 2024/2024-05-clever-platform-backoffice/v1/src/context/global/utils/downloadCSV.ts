export default function downloadCSV(data: Blob, fileName: string) {
  const reader = new FileReader();
  reader.onload = () => {
    const csvContent = reader.result as string;

    // Add BOM for UTF-8
    const bom = '\uFEFF';
    const blobWithBom = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = window.URL.createObjectURL(blobWithBom);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  reader.readAsText(data, 'utf-8');
}
