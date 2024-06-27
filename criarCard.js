const fetch = require('node-fetch');

module.exports = async (req, res) => {
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
    const response = await fetch(`https://api.clickup.com/api/v2/list/${list_id}/task`, {
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

    if (!response.ok) {
      const errorData = await response.json();
      res.status(response.status).json({ error: errorData.err });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor', details: error.message });
  }
};
