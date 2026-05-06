const MasterDropdownCache = new Map();

function mapToIdName(rows) {
    return (rows ?? [])
        .map(x => ({
            id: x.id ?? x.value ?? x.userId ?? x.masterUserId,
            name: x.name ?? x.text ?? x.fullName ?? x.displayName
        }))
        .filter(x => x.id != null && String(x.id) !== '')
        .filter(x => String(x.name ?? '').trim() !== '');
}

function renderDropdown({ selectId, items, includeEmpty = false, emptyText = '-- กรุณาเลือก --', selectedValue = null }) {

    const el = document.getElementById(selectId);
    if (!el) return;

    const $el = $(el);


    if ($el.hasClass('select2-hidden-accessible')) {
        $el.select2('destroy');
    }

    el.innerHTML = '';

    if (includeEmpty) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = emptyText;
        el.appendChild(opt);
    }

    if (selectId == 'cashInput') {
        (items ?? []).forEach(x => {
            const opt = document.createElement('option');
            opt.value = x.id;
            opt.textContent = (x.branchcode ?? x.code ?? '').toString();
            el.appendChild(opt);
        });
    } else { 
        (items ?? []).forEach(x => {
            const opt = document.createElement('option');
            opt.value = x.id;
            opt.textContent = (x.name ?? x.text ?? '').toString(); // ✅ รองรับ text ด้วย
            el.appendChild(opt);
        });
    }

    if (selectedValue != null) el.value = String(selectedValue);
}

function loadMasterDropdown({ request, cacheKey, forceReload = false, onLoaded }) {
    return new Promise((resolve, reject) => {
        const key = cacheKey ?? JSON.stringify(request);

        if (!forceReload && MasterDropdownCache.has(key)) {
            const items = MasterDropdownCache.get(key);
            onLoaded?.(items);
            return resolve(items);
        }

        const payload = { ...request, includeData: true };

        $.requestAjax({
            service: 'MasterDropdown/GetMasterDropdownData',
            type: 'POST',
            parameter: payload,
            enableLoader: false,
            onSuccess: function (res) {
                if (!res?.is_success) {
                    alert(res?.msg_desc ?? 'โหลดข้อมูล dropdown ไม่สำเร็จ');
                    return reject(res);
                }

                const items = mapToIdName(res.data);
                MasterDropdownCache.set(key, items);
                onLoaded?.(items);
                resolve(items);
            }
        });
    });
}

function loadMasterDropdownNotMap({ request, cacheKey, forceReload = false, onLoaded }) {
    return new Promise((resolve, reject) => {
        const key = cacheKey ?? JSON.stringify(request);

        if (!forceReload && MasterDropdownCache.has(key)) {
            const items = MasterDropdownCache.get(key);
            onLoaded?.(items);
            return resolve(items);
        }

        const payload = { ...request, includeData: true };

        $.requestAjax({
            service: 'MasterDropdown/GetMasterDropdownData',
            type: 'POST',
            parameter: payload,
            enableLoader: true,
            onSuccess: function (res) {
                if (!res?.is_success) {
                    alert(res?.msg_desc ?? 'โหลดข้อมูล dropdown ไม่สำเร็จ');
                    return reject(res);
                }

                const items = res.data;
                MasterDropdownCache.set(key, items);
                onLoaded?.(items);
                resolve(items);
            }
        });
    });
}

function initSelect2InModal(modalSelector, selectSelector, placeholder, onChange, opt = {}) {
    const $modal = $(modalSelector);
    const dropdownParent = opt.dropdownParent === 'body' ? $(document.body) : $modal;

    $modal.off(`.initSelect2${selectSelector}`);

    $modal.on(`shown.bs.modal.initSelect2${selectSelector}`, function () {
        const $ddl = $(selectSelector);

        if ($ddl.hasClass('select2-hidden-accessible')) {
            $ddl.select2('destroy');
        }

        $ddl.select2({
            placeholder: placeholder ?? '',
            allowClear: true,
            width: '100%',
            minimumResultsForSearch: 10,
            dropdownParent: dropdownParent
        });

        $ddl.off(`change.initSelect2${selectSelector}`)
            .on(`change.initSelect2${selectSelector}`, function () {
                if (window.isResettingSelect) return;
                onChange?.(this.value);
            });
    });
}

function initSelect2Normal(selector, placeholder, onChange, options = {}) {
    const $el = $(selector);

    $el.off('change.initSelect2Normal');

    if ($el.hasClass('select2-hidden-accessible')) {
        $el.select2('destroy');
    }

    const cfg = {
        theme: 'bootstrap-5',
        placeholder,
        minimumResultsForSearch: 10,
        allowClear: true,
        dropdownParent: options.dropdownParent ? $(options.dropdownParent) : undefined
    };

    if (typeof options.templateResult === 'function') cfg.templateResult = options.templateResult;
    if (typeof options.templateSelection === 'function') cfg.templateSelection = options.templateSelection;

    $el.select2(cfg);

    $el.on('change.initSelect2Normal', function () {
        onChange?.($el.val());
    });
}

function initSelect2NormalWithSearch(selector, placeholder, onChange, options = {}) {
    const $el = $(selector);

    $el.off('change.initSelect2Normal');

    if ($el.hasClass('select2-hidden-accessible')) {
        $el.select2('destroy');
    }

    const cfg = {
        theme: 'bootstrap-5',
        placeholder,
        minimumResultsForSearch: 0,
        // allowClear: true,
        dropdownParent: options.dropdownParent ? $(options.dropdownParent) : undefined
    };

    if (typeof options.templateResult === 'function') cfg.templateResult = options.templateResult;
    if (typeof options.templateSelection === 'function') cfg.templateSelection = options.templateSelection;

    $el.select2(cfg);

    $el.on('change.initSelect2Normal', function () {
        onChange?.($el.val());
    });
}

function loadMasterDropdownWithZone({ request, cacheKey, forceReload = false, onLoaded }) {
    return new Promise((resolve, reject) => {
        const key = cacheKey ?? JSON.stringify(request);

        if (!forceReload && MasterDropdownCache.has(key)) {
            const items = MasterDropdownCache.get(key);
            onLoaded?.(items);
            return resolve(items);
        }

        const payload = { ...request, includeData: true };

        $.requestAjax({
            service: 'MasterDropdown/GetMasterDropdownChashpointWithZone',
            type: 'POST',
            parameter: payload,
            enableLoader: true,
            onSuccess: function (res) {
                if (!res?.is_success) {
                    alert(res?.msg_desc ?? 'โหลดข้อมูล dropdown ไม่สำเร็จ');
                    return reject(res);
                }

                const items = res.data;
                MasterDropdownCache.set(key, items);
                onLoaded?.(items);
                resolve(items);
            }
        });
    });
}