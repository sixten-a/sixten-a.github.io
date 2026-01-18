// Admin logic for Sixun sovellukset
const VALID_USERNAME = "Sixten-a";
// Note: We use Supabase Auth for actual verification, 
// but we'll keep the UI flow similar.

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    // Clear previous errors
    errorMessage.classList.remove("show");

    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        errorMessage.textContent = "Kirjautuminen epäonnistui: " + error.message;
        errorMessage.classList.add("show");
    } else {
        closeLoginModal();
        updateUIForLoggedIn();
    }
}

async function handleLogout() {
    await window.supabaseClient.auth.signOut();
    updateUIForLoggedOut();
}

async function saveTitle() {
    const newTitle = document.getElementById("editTitle").value;
    if (newTitle.trim()) {
        const { error } = await window.supabaseClient
            .from('site_settings')
            .upsert({ key: 'site_title', value: newTitle }, { onConflict: 'key' });

        if (error) alert("Virhe tallentaessa: " + error.message);
        else alert("Otsikko tallennettu!");
    }
}

async function saveBackgroundColor() {
    const color = document.getElementById("editBackgroundColor").value;
    if (color) {
        const { error } = await window.supabaseClient
            .from('site_settings')
            .upsert({ key: 'background_color', value: color }, { onConflict: 'key' });

        if (error) alert("Virhe tallentaessa: " + error.message);
        else alert("Tausta tallennettu!");
    }
}

async function saveBackgroundUrl() {
    const url = document.getElementById("editBackgroundUrl").value;
    const { error } = await window.supabaseClient
        .from('site_settings')
        .upsert({ key: 'background_url', value: url.trim() }, { onConflict: 'key' });

    if (error) alert("Virhe tallentaessa: " + error.message);
    else alert("Tausta-URL päivitetty!");
}

async function resetSiteFromAdmin() {
    if (confirm("Oletko VARMA? Kaikki muokkaukset palautetaan oletuksiin!")) {
        const updates = [
            { key: 'site_title', value: 'Sixun sovellukset' },
            { key: 'background_color', value: '#0d5f2c' },
            { key: 'background_url', value: '' }
        ];

        const { error } = await window.supabaseClient
            .from('site_settings')
            .upsert(updates, { onConflict: 'key' });

        if (error) alert("Virhe resetoidessa: " + error.message);
        else alert("Sivun muokkaukset resetoitu!");
    }
}

// Global functions for UI
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.saveTitle = saveTitle;
window.saveBackgroundColor = saveBackgroundColor;
window.saveBackgroundUrl = saveBackgroundUrl;
window.resetSiteFromAdmin = resetSiteFromAdmin;
