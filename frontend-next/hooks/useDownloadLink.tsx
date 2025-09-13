export default function useDownloadLink({data, name}: {data: any, name: string}) {
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.xlsx`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
}
