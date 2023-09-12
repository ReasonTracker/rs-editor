export default async function readFromLocalFile<T>(): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const element = document.createElement('div');
        element.innerHTML = '<input type="file">';
        const fileInput = element.firstChild as HTMLInputElement;
        if (fileInput) {
            fileInput.addEventListener('change', function () {
                if (fileInput.files) {
                    var file = fileInput.files[0];
                    if (file.name.match(/\.(txt|json)$/)) {
                        var reader = new FileReader();
                        reader.onload = async function () {
                            resolve(JSON.parse(reader.result as string));
                        }
                        reader.readAsText(file);
                    } else {
                        reject("File not supported, .txt or .json files only");
                    }
                }
            });
            fileInput.click();
        }
        reject("unable to add file input element");
    });
}