export default function useDownloadLink(data: any) {
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Masterlist.xlsx";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
}
