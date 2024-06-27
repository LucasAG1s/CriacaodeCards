const fetch = require('node-fetch');
const { VercelRequest, VercelResponse } = require('@vercel/node');

module.exports = async (req = VercelRequest, res = VercelResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  const { list_id, card_name, card_description } = req.body;

  if (!list_id || !card_name || !card_description) {
    res.status(400).json({ error: 'Parâmetros faltando' });
    return;
  }

  const client_id = '8GQAF53G13YEHKKB9K8WDXCMXJST8X9V';
  const token = '5ANEND8LR23BFFNQE41FJ7J3MW8XLC5FZGRKYRNDXR4WULJ7FDLDC2M61D4K4LLU';

  try {
    // Criar card no ClickUp
    const clickUpResponse = await fetch(`https://api.clickup.com/api/v2/list/${list_id}/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        name: card_name,
        description: card_description
      })
    });

    const clickUpData = await clickUpResponse.json();

    if (!clickUpResponse.ok) {
      console.error('Erro ao criar card no ClickUp:', clickUpData);
      res.status(clickUpResponse.status).json({ error: clickUpData.err });
      return;
    }

    // Salvar dados no banco de dados da Vercel
    const dbResponse = await fetch(`https://vercel.com/lucasag1s-projects/criacaode-cards/stores/edge-config/ecfg_x4qkt6llqumkxcqjbi0larjaxezm/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        list_id,
        card_name,
        card_description,
        clickup_task_id: clickUpData.id
      })
    });

    const dbData = await dbResponse.json();

    if (!dbResponse.ok) {
      console.error('Erro ao salvar dados no banco de dados:', dbData);
      res.status(dbResponse.status).json({ error: dbData.error });
      return;
    }

    res.status(200).json({ clickUpData, dbData });
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ error: 'Erro no servidor', details: error.message });
  }
};
