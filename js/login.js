document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('password-toggle');
    const errorBanner = document.getElementById('error-banner');
    const submitBtn = document.getElementById('btn-login');
    const btnText = submitBtn ? submitBtn.querySelector('span') : null;
    const toggleRegisterLink = document.getElementById('toggle-register');
    const continueGuestLink = document.getElementById('btn-continue-guest');
    const loginSubtitle = document.querySelector('.login-subtitle');

    let mode = 'login'; // 'login' or 'register'

    // Get configured API url (default to local json-server)
    const getApiUrl = () => {
        const savedUrl = localStorage.getItem('nothing_budget_api_url');
        if (savedUrl) return savedUrl;
        return (window.location.origin && window.location.origin.startsWith('http')) 
            ? window.location.origin 
            : 'http://localhost:8080';
    };

    // Detect DB mode
    async function detectDbMode(apiUrl) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1000);
            const res = await fetch(`${apiUrl}/transactions?_limit=1`, { signal: controller.signal });
            clearTimeout(timeoutId);
            return res.ok ? 'json-server' : 'localstorage';
        } catch (e) {
            return 'localstorage';
        }
    }

    // Toggle Mode
    if (toggleRegisterLink) {
        toggleRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (errorBanner) errorBanner.style.display = 'none';
            usernameInput.style.borderColor = '';
            passwordInput.style.borderColor = '';

            if (mode === 'login') {
                mode = 'register';
                if (loginSubtitle) loginSubtitle.innerText = 'CREATE NEW ACCOUNT';
                if (btnText) btnText.innerText = 'CREATE ACCOUNT';
                toggleRegisterLink.innerText = 'Already have an account? Sign In';
            } else {
                mode = 'login';
                if (loginSubtitle) loginSubtitle.innerText = 'SECURE ACCESS PORTAL';
                if (btnText) btnText.innerText = 'ACCESS PORTAL';
                toggleRegisterLink.innerText = "Don't have an account? Register";
            }
        });
    }

    // Continue as Guest
    if (continueGuestLink) {
        continueGuestLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.setItem('username', 'Guest');
            window.location.href = 'index.html';
        });
    }

    // Toggle Password Visibility
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            passwordToggle.innerText = isPassword ? '🙈' : '👁';
            passwordToggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    }

    // Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous errors
            if (errorBanner) errorBanner.style.display = 'none';
            usernameInput.style.borderColor = '';
            passwordInput.style.borderColor = '';

            let username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // Validation: Both fields required
            if (!username || !password) {
                if (errorBanner) {
                    errorBanner.innerText = 'ERROR: ALL SECURITY FIELDS ARE REQUIRED.';
                    errorBanner.style.display = 'block';
                }
                if (!username) usernameInput.style.borderColor = 'var(--accent-red)';
                if (!password) passwordInput.style.borderColor = 'var(--accent-red)';
                return;
            }

            // Simulated Handshake / Loading state
            submitBtn.disabled = true;
            usernameInput.disabled = true;
            passwordInput.disabled = true;
            if (passwordToggle) passwordToggle.style.pointerEvents = 'none';
            
            if (btnText) btnText.innerText = mode === 'login' ? 'CONNECTING' : 'CREATING';
            const caret = document.createElement('span');
            caret.className = 'caret-blink';
            submitBtn.appendChild(caret);

            const apiUrl = getApiUrl();
            const dbMode = await detectDbMode(apiUrl);

            // simulated network auth handshake delay (800ms)
            setTimeout(async () => {
                try {
                    let authSuccess = false;
                    let errorMsg = '';

                    if (dbMode === 'json-server') {
                        // SERVER MODE
                        if (mode === 'login') {
                            // Fetch all users to verify case-insensitively
                            const res = await fetch(`${apiUrl}/users`);
                            let users = [];
                            if (res.ok) {
                                users = await res.json();
                            } else {
                                // Fallback: try direct query if listing users is not allowed
                                const singleRes = await fetch(`${apiUrl}/users/${encodeURIComponent(username)}`);
                                if (singleRes.ok) {
                                    users = [await singleRes.json()];
                                }
                            }

                            const user = users.find(u => u.id.toLowerCase() === username.toLowerCase());
                            if (user) {
                                if (user.password === password) {
                                    authSuccess = true;
                                    username = user.id; // use correct casing from DB
                                } else {
                                    errorMsg = 'INVALID PASSWORD. ACCESS DENIED.';
                                }
                            } else {
                                // Fallback: check localstorage in case they registered while offline
                                const localUsers = JSON.parse(localStorage.getItem('nothing_budget_users')) || [];
                                const localUser = localUsers.find(u => u.id.toLowerCase() === username.toLowerCase());
                                if (localUser) {
                                    if (localUser.password === password) {
                                        // Auto-sync account to the server
                                        const syncRes = await fetch(`${apiUrl}/users`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ id: localUser.id, password: password })
                                        });
                                        if (syncRes.ok) {
                                            authSuccess = true;
                                            username = localUser.id; // use correct casing from localStorage
                                        } else {
                                            errorMsg = 'FAILED TO SYNC OFFLINE ACCOUNT TO SERVER.';
                                        }
                                    } else {
                                        errorMsg = 'INVALID PASSWORD. ACCESS DENIED.';
                                    }
                                } else {
                                    errorMsg = 'ACCOUNT NOT FOUND.';
                                }
                            }
                        } else {
                            // Register mode
                            const res = await fetch(`${apiUrl}/users`);
                            let users = [];
                            if (res.ok) {
                                users = await res.json();
                            } else {
                                const singleRes = await fetch(`${apiUrl}/users/${encodeURIComponent(username)}`);
                                if (singleRes.ok) {
                                    users = [await singleRes.json()];
                                }
                            }

                            const exists = users.some(u => u.id.toLowerCase() === username.toLowerCase());
                            if (exists) {
                                errorMsg = 'USERNAME ALREADY TAKEN.';
                            } else {
                                const regRes = await fetch(`${apiUrl}/users`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ id: username, password: password })
                                });
                                if (regRes.ok) {
                                    authSuccess = true;
                                } else {
                                    errorMsg = 'REGISTRATION FAILED.';
                                }
                            }
                        }
                    } else {
                        // LOCALSTORAGE MODE
                        const users = JSON.parse(localStorage.getItem('nothing_budget_users')) || [];
                        const userIndex = users.findIndex(u => u.id.toLowerCase() === username.toLowerCase());

                        if (mode === 'login') {
                            if (userIndex !== -1 && users[userIndex].password === password) {
                                authSuccess = true;
                                username = users[userIndex].id; // use correct casing from localStorage
                            } else if (userIndex === -1) {
                                errorMsg = 'ACCOUNT NOT FOUND.';
                            } else {
                                errorMsg = 'INVALID PASSWORD. ACCESS DENIED.';
                            }
                        } else {
                            // Register
                            if (userIndex !== -1) {
                                errorMsg = 'USERNAME ALREADY TAKEN.';
                            } else {
                                users.push({ id: username, password: password });
                                localStorage.setItem('nothing_budget_users', JSON.stringify(users));
                                authSuccess = true;
                            }
                        }
                    }

                    if (authSuccess) {
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('username', username);
                        localStorage.setItem('nothing_budget_db_mode', dbMode);

                        // Check if guest has data to sync
                        const transGuest = JSON.parse(localStorage.getItem('nothing_budget_transactions_guest')) || [];
                        const billsGuest = JSON.parse(localStorage.getItem('nothing_budget_bills_guest')) || [];
                        const wantsGuest = JSON.parse(localStorage.getItem('nothing_budget_wants_guest')) || [];
                        
                        if (transGuest.length > 0 || billsGuest.length > 0 || wantsGuest.length > 0) {
                            localStorage.setItem('sync_pending', 'true');
                        }

                        window.location.href = 'index.html';
                    } else {
                        if (errorBanner) {
                            errorBanner.innerText = `ERROR: ${errorMsg}`;
                            errorBanner.style.display = 'block';
                        }
                        resetFormState();
                    }
                } catch (err) {
                    console.error('Authentication error:', err);
                    if (errorBanner) {
                        errorBanner.innerText = 'ERROR: NETWORK OR SERVER FAULT.';
                        errorBanner.style.display = 'block';
                    }
                    resetFormState();
                }
            }, 800);
        });
    }

    function resetFormState() {
        submitBtn.disabled = false;
        usernameInput.disabled = false;
        passwordInput.disabled = false;
        if (passwordToggle) passwordToggle.style.pointerEvents = 'auto';
        if (btnText) btnText.innerText = mode === 'login' ? 'ACCESS PORTAL' : 'CREATE ACCOUNT';
        if (submitBtn.querySelector('.caret-blink')) {
            submitBtn.querySelector('.caret-blink').remove();
        }
    }
});
