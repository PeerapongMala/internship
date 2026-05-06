// ============================================================
// Reconciliation Display 2 — secondScreenReconsile.js
// Sync via localStorage (no cross-document DOM manipulation)
// ============================================================
console.log('[D2 secondScreenReconsile.js] v4 loaded');

// Marker: D2 scripts fully loaded
window.d2Ready = true;

// ---- State refresh (CSS visibility) ----
function refreshScreen() {
    var state = document.getElementById('d2State').value;

    // Toggle body state class — CSS handles all visibility
    document.body.className = document.body.className
        .replace(/d2-state-\w+/g, '').trim();
    document.body.classList.add('d2-state-' + state);

    // Clear badge content on initial/inprogress
    if (state === 'initial' || state === 'inprogress') {
        var badgeArea = document.getElementById('d2BadgeArea');
        if (badgeArea) badgeArea.innerHTML = '';
    }

    // Debug label
    var debugEl = document.getElementById('d2DebugState');
    if (debugEl) debugEl.textContent = 'state: ' + state;

    console.log('[D2] refreshScreen → state:', state);

    // Marquee update (defined in master secondScreen.js)
    if (typeof updateMarquee === 'function') updateMarquee();
}

// ---- Apply full D2 state from data object ----
function applyD2State(data) {
    if (!data) return;

    if (data.state) {
        var stateEl = document.getElementById('d2State');
        if (stateEl) stateEl.value = data.state;
    }
    if (data.bankCode !== undefined) {
        var el = document.getElementById('d2BankCode');
        if (el) el.textContent = data.bankCode;
    }
    if (data.machineName !== undefined) {
        var el = document.getElementById('d2MachineName');
        if (el) el.textContent = data.machineName;
    }
    if (data.branchName !== undefined) {
        var el = document.getElementById('d2BranchName');
        if (el) el.textContent = data.branchName;
    }
    if (data.headerCard !== undefined) {
        var el = document.getElementById('d2HeaderCard');
        if (el) el.textContent = data.headerCard;
    }
    if (data.denom !== undefined) {
        var denomEl = document.getElementById('d2Denom');
        if (denomEl) {
            denomEl.textContent = data.denom ? ('\u0E3F' + data.denom) : '';
            denomEl.className = 'd2-denom' + (data.denom ? ' d2-denom-' + data.denom : '');
        }
    }
    if (data.rejectCount !== undefined && data.rejectCount !== null && data.rejectCount !== '') {
        var rejectEl = document.getElementById('d2RejectCount');
        if (rejectEl) rejectEl.textContent = data.rejectCount;
    }
    if (data.badges) {
        renderD2Badges(data.badges);
    }

    refreshScreen();
}

// ---- Badge rendering (local — no cross-document needed) ----
function renderD2Badges(badges) {
    var area = document.getElementById('d2BadgeArea');
    if (!area) return;

    area.innerHTML = '';
    if (!badges || badges.length === 0) return;

    var bar = document.createElement('div');
    var isSuccess = badges[0].type === 'success';
    bar.className = 'd2-badge-bar ' + (isSuccess ? 'd2-badge-bar-success' : 'd2-badge-bar-error');

    if (badges.length === 1 && !badges[0].desc) {
        // Single badge — just title
        var title = document.createElement('div');
        title.className = 'd2-badge-title';
        title.textContent = badges[0].text;
        bar.appendChild(title);
    } else if (badges.length === 1 && badges[0].desc) {
        // Single badge with description
        var title = document.createElement('div');
        title.className = 'd2-badge-title';
        title.textContent = badges[0].text;
        bar.appendChild(title);
        var desc = document.createElement('div');
        desc.className = 'd2-badge-desc';
        desc.textContent = badges[0].desc;
        bar.appendChild(desc);
    } else {
        // Multiple error tags in one bar
        var tagsDiv = document.createElement('div');
        tagsDiv.className = 'd2-badge-tags';
        badges.forEach(function (b) {
            var tag = document.createElement('span');
            tag.className = 'd2-badge-tag';
            tag.textContent = b.text;
            tagsDiv.appendChild(tag);
        });
        bar.appendChild(tagsDiv);
    }

    area.appendChild(bar);
}

// ---- Real-time sync: listen for localStorage changes from parent ----
window.addEventListener('storage', function (e) {
    if (e.key === 'bss-d2-reconsile') {
        if (!e.newValue) {
            // localStorage.removeItem → กลับ initial
            console.log('[D2] storage event → removed → initial');
            applyD2State({ state: 'initial' });
            return;
        }
        try {
            var data = JSON.parse(e.newValue);
            console.log('[D2] storage event → state:', data.state);
            applyD2State(data);
        } catch (err) {
            console.warn('[D2] storage parse error:', err);
        }
    }
});

// ---- Re-read localStorage on focus (covers close/reopen, alt-tab, minimize/restore) ----
window.addEventListener('focus', function () {
    try {
        var stored = localStorage.getItem('bss-d2-reconsile');
        if (stored) {
            var data = JSON.parse(stored);
            if (data && data.state) {
                applyD2State(data);
            }
        }
    } catch (e) {}
});

// ---- On load: read current state from localStorage ----
document.addEventListener('DOMContentLoaded', function () {
    try {
        var stored = localStorage.getItem('bss-d2-reconsile');
        if (stored) {
            var data = JSON.parse(stored);
            if (data && data.state && data.state !== 'initial') {
                console.log('[D2] loaded from localStorage → state:', data.state);
                applyD2State(data);
            }
        }
    } catch (e) {
        console.warn('[D2] localStorage read error:', e);
    }
});
