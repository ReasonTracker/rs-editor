export default async function saveToLocalFile (dataString: string, suggestedFileName: string): Promise<void> {
    if (window.showSaveFilePicker) {
        const fileHandle = await window.showSaveFilePicker();
        const writable = await fileHandle.createWritable();
        await writable.write(dataString);
        await writable.close();
    } else {
        if (window.confirm("Please use Chrome version 91 or above to download large files. Do you want to attempt anyay?")) {
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(dataString);
            hiddenElement.target = '_blank';
            hiddenElement.download = suggestedFileName;
            hiddenElement.click();
        }
    }
}