// Форматирование вывода валют

const toCurrency = (price) => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'rub',
        currencyDisplay: 'symbol',
    }).format(price);
};

// document.populate([{ path: keyString, strictPopulate: false }]);

document.querySelectorAll('.price').forEach((node) => {
    node.textContent = toCurrency(node.textContent);
});

// Форматирование вывода даты
const toDate = (date) => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date(date));
};

document.querySelectorAll('.date').forEach((node) => {
    node.textContent = toDate(node.textContent);
});

// new Intl.NumberFormat("en", {style: "currency", currency: "USD"}).format(value);

const $card = document.querySelector('#card');
if ($card) {
    $card.addEventListener('click', (event) => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id;

            fetch('/card/remove/' + id, {
                method: 'delete',
            })
                .then((res) => res.json())
                .then((card) => {
                    if (card.courses.length) {
                        const html = card.courses
                            .map((c) => {
                                return `
                        <tr>
                        <td>${c.title}</td>
                        <td>${c.count} </td>
                        <td>${c.price} </td>
                        <td>
                            <button
                                class='btn btn-small js-remove'
                                data-id='${c.id}'
                            >Delete</button>
                        </td>
                    </tr>
                        `;
                            })
                            .join('');
                        $card.querySelector('tbody').innerHTML = html;
                        $card.querySelector('.price').textContent = toCurrency(
                            card.price
                        );
                    } else {
                        $card.innerHTML = '<p> Basket is empty</p>';
                    }
                });
        }
    });
}

// Инициализация функционала авторизации,
// взятого из
// https://materializecss.com/tabs.html
var instance = M.Tabs.init(document.querySelectorAll('.tabs'));
