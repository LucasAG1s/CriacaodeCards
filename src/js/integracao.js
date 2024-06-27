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

    async function criarCardClickUp(data) {
        try {
            const response = await fetch("/api/criarCard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                alert('Card criado com sucesso no ClickUp e dados salvos no banco de dados!');
            } else {
                console.error('Erro ao criar card:', result);
                alert(`Erro ao criar card: ${result.error}`);
            }
        } catch (error) {
            console.error('Erro ao criar card:', error);
            alert('Erro ao criar card no ClickUp.');
        }
    }

    const btnEnviar = document.querySelector('.btn-enviar');
    btnEnviar.addEventListener('click', function(event) {
        event.preventDefault();

        const solicitante = document.getElementById('inputSolicitante').value;
        const descricao = document.getElementById('inputDescricao').value;
        const caminho = document.getElementById('inputCaminho').value;

        const niveisSelecionados = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.nextElementSibling.innerText);
        
        if (niveisSelecionados.length === 0) {
            alert('Por favor, selecione um nível.');
            return;
        }

        const data = {
            list_id: "901301931428", // ID da lista no ClickUp
            card_name: `${solicitante} - ${niveisSelecionados.join(", ")}`,
            card_description: `Descrição: ${descricao}\nCaminho: ${caminho}`
        };

        criarCardClickUp(data);
    });
});
