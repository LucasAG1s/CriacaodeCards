document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('form');
    const btnEnviar = document.querySelector('.btn-enviar');

    btnEnviar.addEventListener('click', async function(event) {
        event.preventDefault();

        const nomeSolicitante = document.getElementById('inputSolicitante').value;
        const niveisSelecionados = getNiveisSelecionados();
        const descricaoErro = document.getElementById('inputDescricao').value;
        const caminhoErro = document.getElementById('inputCaminho').value;
        const arquivos = document.getElementById('arquivoInput').files;

        // Exemplo de URL da API do ClickUp para criar tarefa
        const apiUrl = 'https://api.clickup.com/api/v2/task';

        // Dados da tarefa a ser criada
        const taskData = {
            name: descricaoErro,
            content: `Solicitante: ${nomeSolicitante}\nNíveis: ${niveisSelecionados}\nCaminho do erro: ${caminhoErro}`,
            // Aqui você deve ajustar os campos de acordo com o que a API do ClickUp espera
        };

        try {
            // Enviar tarefa para o ClickUp
            const responseTask = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': '5ANEND8LR23BFFNQE41FJ7J3MW8XLC5FZGRKYRNDXR4WULJ7FDLDC2M61D4K4LLU', // Substitua pelo seu token de acesso
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });

            if (!responseTask.ok) {
                throw new Error('Erro ao criar tarefa no ClickUp.');
            }

            const task = await responseTask.json();
            const taskId = task.id;

            // Enviar anexos para a tarefa
            if (arquivos.length > 0) {
                const attachmentsUrl = `https://api.clickup.com/api/v2/task/${taskId}/attachment`;
                const formData = new FormData();

                Array.from(arquivos).forEach(file => {
                    formData.append('file', file);
                });

                const responseAttachments = await fetch(attachmentsUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': '5ANEND8LR23BFFNQE41FJ7J3MW8XLC5FZGRKYRNDXR4WULJ7FDLDC2M61D4K4LLU', // Substitua pelo seu token de acesso
                    },
                    body: formData,
                });

                if (!responseAttachments.ok) {
                    throw new Error('Erro ao enviar anexos para o ClickUp.');
                }

                console.log('Anexos enviados com sucesso para a tarefa no ClickUp.');
            } else {
                console.warn('Nenhum arquivo selecionado para enviar como anexo.');
            }

            console.log('Tarefa criada com sucesso no ClickUp.');

            // Lógica adicional, como limpar o formulário ou mostrar mensagem de sucesso

        } catch (error) {
            console.error('Erro ao interagir com o ClickUp:', error);
        }
    });

    // Função para obter os níveis selecionados
    function getNiveisSelecionados() {
        const checkboxes = document.querySelectorAll('.Niveis input[type="checkbox"]:checked');
        const niveisSelecionados = Array.from(checkboxes).map(checkbox => checkbox.nextElementSibling.textContent);
        return niveisSelecionados.join(', ');
    }
});
