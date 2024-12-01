export default async function readFromLocalFile<T>(processString?: (input: string) => string): Promise<T> {
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
                            try {
                                let result = reader.result as string;
                                if (processString) {
                                    result = processString(result);
                                }
                                resolve(JSON.parse(result));
                            } catch (error) {
                                reject(error);
                            }
                        }
                        reader.readAsText(file);
                    } else {
                        reject("File not supported, .txt or .json files only");
                    }
                }
            });
            fileInput.click();
        } else { 
            reject("unable to add file input element");
        }
    });
}