const xeSmartMove = {
    vinbus: {
        title: 'Xe buýt điện VinBus',
        image: 'images/vinbus.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1000&q=85',
        summary: 'Xe buýt điện phục vụ nhu cầu đi lại công cộng, hướng tới giao thông xanh.',
        details: `• Loại phương tiện: Xe buýt điện
• Năng lượng: Điện
• Mục đích: Vận tải hành khách công cộng
• Lưu ý: Sức chứa, thông số và tuyến hoạt động tùy mẫu xe, đơn vị vận hành.`
    },
    lachong: {
        title: 'Ô tô VinFast Lạc Hồng',
        image: 'images/lac-hong.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85',
        summary: 'Dòng xe cao cấp mang thương hiệu VinFast.',
        details: `• Thương hiệu: VinFast
• Dòng xe: Lạc Hồng
• Định hướng: Trải nghiệm di chuyển cao cấp
• Lưu ý: Trang bị và thông số cụ thể tùy mẫu xe, phiên bản.`
    },
    ventos: {
        title: 'Xe máy điện VinFast Vento S',
        image: 'images/vento-s.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=85',
        summary: 'Xe máy điện dành cho nhu cầu di chuyển cá nhân trong đô thị.',
        details: `• Động cơ Side Motor IPM: công suất tối đa 5.200 W; công suất định danh 3.000 W
• Tốc độ tối đa: 89 km/h
• Tăng tốc 0–49 km/h: khoảng 6,2 giây
• Pin LFP: 3,5 kWh (70,4 V – 48 Ah), chuẩn chống nước IP67
• Quãng đường công bố: khoảng 160 km/lần sạc trong điều kiện thử nghiệm ở tốc độ 30 km/h, tải trọng 65 kg
• Thời gian sạc: khoảng 6 giờ với bộ sạc 1.000 W
• Thông số thực tế có thể thay đổi theo điều kiện sử dụng và phiên bản xe.`
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setupServiceCards();
    setupLoginModal();
    setupHomeBookingForm();
    setupRouteBookingForm();
    setupContactForm();
    fillBookingFromUrl();

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal('serviceModal');
            closeModal('loginModal');
        }
    });
});

/* Thông tin và popup phương tiện */
function setupServiceCards() {
    const modal = document.getElementById('serviceModal');

    document.querySelectorAll('.card').forEach((card) => {
        if (!card.dataset.vehicle && !card.dataset.title) return;

        const cardImage = card.querySelector('img');
        const vehicle = getVehicleInfo(card);

        // Nếu ảnh trong images/ chưa có, thử ảnh minh họa trực tuyến.
        if (cardImage && vehicle?.fallbackImage) {
            cardImage.addEventListener('error', () => {
                if (cardImage.dataset.fallbackUsed === 'true') {
                    cardImage.classList.add('image-missing');
                    return;
                }

                cardImage.dataset.fallbackUsed = 'true';
                cardImage.src = vehicle.fallbackImage;
            });
        }

        card.addEventListener('click', () => {
            if (!modal) return;

            const info = getVehicleInfo(card);
            if (!info) return;

            const image = document.getElementById('modalImg');
            const title = document.getElementById('modalTitle');
            const shortDesc = document.getElementById('modalShortDesc');
            const longDesc = document.getElementById('modalLongDesc');

            if (image) {
                image.dataset.fallbackUsed = 'false';
                image.onerror = () => {
                    if (image.dataset.fallbackUsed === 'true') {
                        image.removeAttribute('src');
                        image.alt = 'Không tải được ảnh phương tiện.';
                        return;
                    }

                    image.dataset.fallbackUsed = 'true';
                    image.src = info.fallbackImage || '';
                };
                image.src = info.image;
                image.alt = info.title;
            }

            if (title) title.textContent = info.title;
            if (shortDesc) shortDesc.textContent = info.summary;
            if (longDesc) longDesc.textContent = info.details;

            openModal(modal);
        });
    });

    modal?.querySelector('.close-btn')?.addEventListener('click', () => {
        closeModal('serviceModal');
    });

    modal?.addEventListener('click', (event) => {
        if (event.target === modal) closeModal('serviceModal');
    });

    modal?.querySelector('.modal-booking-link')?.addEventListener('click', () => {
        closeModal('serviceModal');
    });
}

function getVehicleInfo(card) {
    const key = (card.dataset.vehicle || '').toLowerCase();
    let info = xeSmartMove[key];

    // Tự nhận dạng dòng xe nếu thẻ chỉ có data-title.
    if (!info) {
        const titleText = (card.dataset.title || '').toLowerCase();

        if (titleText.includes('vento')) info = xeSmartMove.ventos;
        else if (titleText.includes('lạc hồng') || titleText.includes('lac hong')) {
            info = xeSmartMove.lachong;
        } else if (titleText.includes('vinbus') || titleText.includes('buýt')) {
            info = xeSmartMove.vinbus;
        }
    }

    const cardImage = card.querySelector('img');

    return {
        title: card.dataset.title || info?.title || 'Phương tiện SmartMove',
        image: card.dataset.image || info?.image || cardImage?.getAttribute('src') || '',
        fallbackImage: info?.fallbackImage || '',
        summary: card.dataset.short || info?.summary || '',
        details: card.dataset.long || info?.details || 'Chưa có thông tin chi tiết.'
    };
}

/* Popup đăng nhập */
function setupLoginModal() {
    const modal = document.getElementById('loginModal');
    const form = document.getElementById('loginForm');

    document.getElementById('openLoginModal')?.addEventListener('click', () => {
        if (!modal) return;

        openModal(modal);
        document.getElementById('loginEmail')?.focus();
    });

    document.getElementById('closeLoginModal')?.addEventListener('click', () => {
        closeModal('loginModal');
    });

    modal?.addEventListener('click', (event) => {
        if (event.target === modal) closeModal('loginModal');
    });

    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Đây là giao diện minh họa, chưa kết nối backend để xác thực tài khoản.');
        form.reset();
        closeModal('loginModal');
    });
}

/* Form tìm chuyến ở trang chủ */
function setupHomeBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const pickup = document.getElementById('pickup')?.value.trim();
        const dropoff = document.getElementById('dropoff')?.value.trim();
        const service = document.getElementById('service')?.value;
        const notRobot = document.getElementById('notRobot');

        if (!pickup || !dropoff) {
            alert('Vui lòng nhập điểm đi và điểm đến.');
            return;
        }

        if (notRobot && !notRobot.checked) {
            alert('Vui lòng xác nhận bạn không phải robot.');
            notRobot.focus();
            return;
        }

        const query = new URLSearchParams({ pickup, dropoff, service });
        window.location.href = `cuoiky3.html?${query.toString()}`;
    });
}

/* Điền hành trình từ URL trên trang đặt xe */
function fillBookingFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const pickup = document.getElementById('pickup');
    const dropoff = document.getElementById('dropoff');
    const service = document.getElementById('service');

    if (pickup && params.has('pickup')) pickup.value = params.get('pickup');
    if (dropoff && params.has('dropoff')) dropoff.value = params.get('dropoff');

    if (service && params.has('service')) {
        const requestedService = params.get('service');
        const option = [...service.options].find(
            (item) => item.value === requestedService || item.text.trim() === requestedService
        );

        if (option) service.value = option.value;
    }
}

/* Tính chi phí trên trang đặt xe */
function setupRouteBookingForm() {
    const form = document.getElementById('routeBookingForm');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const distance = Number(document.getElementById('distance')?.value);
        const vehicleType = document.getElementById('vehicleType')?.value;
        const seatType = document.getElementById('seatType')?.value;
        const result = document.getElementById('bookingResult');

        if (!result) return;

        if (!Number.isFinite(distance) || distance <= 0) {
            alert('Vui lòng nhập quãng đường lớn hơn 0 km.');
            document.getElementById('distance')?.focus();
            return;
        }

        let rate;
        let vehicleName;

        if (vehicleType === 'bike') {
            rate = 5000;
            vehicleName = 'Xe máy điện';
        } else if (vehicleType === 'bus') {
            rate = 30000;
            vehicleName = 'Xe buýt điện';
        } else {
            const rates = {
                '4': { rate: 12000, name: 'Ô tô 4 chỗ' },
                '7': { rate: 15000, name: 'Ô tô 7 chỗ' },
                '16': { rate: 20000, name: 'Xe dịch vụ 16 chỗ' }
            };

            const selected = rates[seatType] || rates['4'];
            rate = selected.rate;
            vehicleName = selected.name;
        }

        const money = new Intl.NumberFormat('vi-VN')
            .format(Math.round(distance * rate));

        const pickup = document.getElementById('pickup')?.value.trim() || 'Chưa nhập';
        const dropoff = document.getElementById('dropoff')?.value.trim() || 'Chưa nhập';
        const service = document.getElementById('service')?.value || 'Chưa chọn';

        result.textContent = [
            `Điểm đi: ${pickup}`,
            `Điểm đến: ${dropoff}`,
            `Dịch vụ: ${service}`,
            `Quãng đường: ${distance} km`,
            `Phương tiện: ${vehicleName}`,
            `Chi phí ước tính: ${money} VNĐ`
        ].join('\n');

        result.style.display = 'block';
    });
}

/* Kiểm tra form liên hệ */
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const fullname = document.getElementById('fullname');
        const phone = document.getElementById('phone');
        const message = document.getElementById('message');
        const nameError = document.getElementById('nameError');
        const phoneError = document.getElementById('phoneError');
        const msgError = document.getElementById('msgError');

        if (!fullname || !phone || !message) return;

        if (nameError) nameError.textContent = '';
        if (phoneError) phoneError.textContent = '';
        if (msgError) msgError.textContent = '';

        let valid = true;

        if (!fullname.value.trim()) {
            if (nameError) nameError.textContent = 'Vui lòng nhập họ và tên.';
            valid = false;
        }

        if (!/^\d{10}$/.test(phone.value.trim())) {
            if (phoneError) phoneError.textContent = 'Số điện thoại phải gồm đúng 10 chữ số.';
            valid = false;
        }

        if (!message.value.trim()) {
            if (msgError) msgError.textContent = 'Vui lòng nhập nội dung cần hỗ trợ.';
            valid = false;
        }

        if (valid) {
            alert('Gửi thông tin thành công! Chúng tôi sẽ liên hệ sớm nhất.');
            form.reset();
        }
    });
}

function openModal(modal) {
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}