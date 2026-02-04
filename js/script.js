// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainMenu = document.getElementById('mainMenu');

    if (mobileMenuBtn && mainMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mainMenu.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        const menuLinks = mainMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainMenu.classList.remove('active');
            });
        });

        // Закрытие меню при клике вне его
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mainMenu.contains(event.target)) {
                mainMenu.classList.remove('active');
            }
        });
    }

    // Калькулятор стоимости
    const calculateBtn = document.getElementById('calculateBtn');
    const calculatorResult = document.getElementById('calculator-result');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const deviceType = document.getElementById('deviceType').value;
            const problemType = document.getElementById('problemType').value;
            const urgency = document.getElementById('urgency').value;

            // Базовые цены (в рублях)
            const prices = {
                server: { diagnostics: 1500, hardware: 3000, software: 2000, preventive: 2500, data: 5000 },
                workstation: { diagnostics: 1000, hardware: 2000, software: 1500, preventive: 1800, data: 3000 },
                laptop: { diagnostics: 800, hardware: 1500, software: 1200, preventive: 1400, data: 2500 },
                network: { diagnostics: 1200, hardware: 2500, software: 1800, preventive: 2000, data: 3500 },
                printer: { diagnostics: 600, hardware: 1000, software: 800, preventive: 900, data: 1500 }
            };

            const urgencyMultipliers = {
                standart: 1,
                express: 1.5,
                urgent: 2
            };

            const basePrice = prices[deviceType][problemType];
            const urgencyMultiplier = urgencyMultipliers[urgency];
            const workCost = Math.round(basePrice * urgencyMultiplier);
            const partCost = Math.round(workCost * 0.3); // Предполагаемая стоимость запчастей
            const total = workCost + partCost;

            // Обновление результатов
            document.getElementById('resultDeviceType').textContent = getDeviceTypeName(deviceType);
            document.getElementById('resultProblemType').textContent = getProblemTypeName(problemType);
            document.getElementById('resultUrgency').textContent = getUrgencyName(urgency);
            document.getElementById('resultWorkCost').textContent = workCost + ' ₽';
            document.getElementById('resultPartCost').textContent = partCost + ' ₽';
            document.getElementById('resultTotal').textContent = total + ' ₽';

            calculatorResult.classList.add('active');
        });
    }

    // Форма заявки
    const repairForm = document.getElementById('repairForm');
    const formStatus = document.getElementById('formStatus');

    if (repairForm) {
        repairForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Простая валидация
            const name = document.getElementById('clientName').value.trim();
            const phone = document.getElementById('clientPhone').value.trim();

            if (!name || !phone) {
                showFormStatus('Пожалуйста, заполните все обязательные поля!', 'error');
                return;
            }

            // Имитация отправки формы
            showFormStatus('Заявка отправлена! Мы свяжемся с вами в течения часа.', 'success');

            // Очистка формы
            repairForm.reset();
        });
    }

    // Плавная прокрутка к якорям
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                event.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Вспомогательные функции для калькулятора
function getDeviceTypeName(type) {
    const names = {
        server: 'Серверное оборудование',
        workstation: 'Рабочая станция',
        laptop: 'Ноутбук',
        network: 'Сетевое оборудование',
        printer: 'Принтер/МФУ'
    };
    return names[type] || type;
}

function getProblemTypeName(type) {
    const names = {
        diagnostics: 'Диагностика',
        hardware: 'Аппаратная проблема',
        software: 'Проблема с ПО',
        preventive: 'Профилактическое обслуживание',
        data: 'Восстановление данных'
    };
    return names[type] || type;
}

function getUrgencyName(type) {
    const names = {
        standart: 'Стандартная (3-5 дней)',
        express: 'Экспресс (1-2 дня)',
        urgent: 'Срочный (в течения дня)'
    };
    return names[type] || type;
}

function showFormStatus(message, type) {
    const formStatus = document.getElementById('formStatus');
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
}
