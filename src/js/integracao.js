document.addEventListener("DOMContentLoaded", function() {
    const checkboxes = document.querySelectorAll(".Niveis input[type='checkbox']");
    const niveisDivs = document.querySelectorAll(".Niveis > div");

    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener("change", () => {
            desselecionarCheckboxes();
            desselecionarNiveisDivs();

            checkbox.checked = true; // Manter o checkbox marcado

            niveisDivs[index].classList.add("selecionado");
        });
    });

    function desselecionarNiveisDivs() {
        niveisDivs.forEach(div => {
            div.classList.remove("selecionado");
        });
    }

    function desselecionarCheckboxes() {
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    // Função para enviar arquivos para o Google Drive
    async function uploadFilesToDrive(files) {
        const url = 'URL_DA_API_GOOGLE_DRIVE'; // Substitua pela URL da API do Google Drive
        const formData = new FormData();

        formData.append('files', files);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar arquivo para o Google Drive.');
            }

            console.log('Arquivo enviado com sucesso para o Google Drive.');
        } catch (error) {
            console.error('Erro ao enviar arquivo:', error);
        }
    }

    // Evento de clique no botão enviar
    const btnEnviar = document.querySelector('.btn-enviar');
    btnEnviar.addEventListener('click', function(event) {
        event.preventDefault();

        const inputFiles = document.getElementById('arquivoInput').files;
        if (inputFiles.length > 0) {
            uploadFilesToDrive(inputFiles);
        } else {
            console.error('Nenhum arquivo selecionado.');
        }
    });
});
