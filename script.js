document.addEventListener('DOMContentLoaded', () => {
    // 1. Переключение дней (Вкладки)
    const tabs = document.querySelectorAll('.day-tab');
    const lists = document.querySelectorAll('.day-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetDay = tab.getAttribute('data-day');
            tabs.forEach(t => t.classList.remove('active'));
            lists.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(targetDay).classList.add('active');
            updateDayProgress(); 
        });
    });

    // 2. Интерактивное вычеркивание карточек
    const cards = document.querySelectorAll('.task-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('completed');
            updateDayProgress();
        });
    });

    // 3. Работа часов и автоматическое определение текущей задачи «СЕЙЧАС»
    function updateApp() {
        const now = new Date();
        
        // Время в формате ЧЧ:ММ:СС
        const timeString = now.toTimeString().split(' ')[0];
        document.getElementById('live-clock').textContent = timeString;

        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        // Проверяем задачи внутри активного на экране дня
        const activeContainer = document.querySelector('.day-content.active');
        const activeCards = activeContainer.querySelectorAll('.task-card');
        
        let currentActiveCard = null;

        // Конвертируем время карточек в минуты
        const cardTimes = Array.from(activeCards).map(card => {
            const [h, m] = card.getAttribute('data-time').split(':').map(Number);
            let totalMinutes = h * 60 + m;
            if (card.hasAttribute('data-next-day') && h < 5) {
                totalMinutes += 24 * 60;
            }
            return { minutes: totalMinutes, element: card };
        });

        // Сортировка расписания по хронологии
        cardTimes.sort((a, b) => a.minutes - b.minutes);

        // Поиск актуального дела под текущую минуту
        for (let i = 0; i < cardTimes.length; i++) {
            const task = cardTimes[i];
            const nextTask = cardTimes[i + 1];

            task.element.classList.remove('current-task');

            if (currentMinutes >= task.minutes && (!nextTask || currentMinutes < nextTask.minutes)) {
                currentActiveCard = task.element;
            }
        }

        // Подсвечиваем активное задание
        if (currentActiveCard) {
            currentActiveCard.classList.add('current-task');
        }
    }

    // 4. Расчет заполнения прогресс-бара
    function updateDayProgress() {
        const activeContainer = document.querySelector('.day-content.active');
        const allTasks = activeContainer.querySelectorAll('.task-card').length;
        const completedTasks = activeContainer.querySelectorAll('.task-card.completed').length;
        
        const percentage = allTasks > 0 ? Math.round((completedTasks / allTasks) * 100) : 0;
        
        document.getElementById('progress-fill').style.width = percentage + '%';
        document.getElementById('progress-text').textContent = percentage + '%';
    }

    // Старт работы
    setInterval(updateApp, 1000);
    updateApp();
    updateDayProgress();
});
