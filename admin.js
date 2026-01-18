// Admin logic for Sixun sovellukset
// Note: We use Supabase Auth for actual verification.

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

// Feedback management functions
async function loadFeedback() {
    const { data, error } = await window.supabaseClient
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Virhe palautteiden latauksessa:", error);
        return [];
    }
    return data;
}

async function markAsRead(id, isRead) {
    const { error } = await window.supabaseClient
        .from('feedback')
        .update({ is_read: isRead, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        alert("Virhe tilan päivityksessä: " + error.message);
        return false;
    }
    return true;
}

async function deleteFeedback(id) {
    if (!confirm("Haluatko varmasti poistaa tämän palautteen?")) return false;

    const { error } = await window.supabaseClient
        .from('feedback')
        .delete()
        .eq('id', id);

    if (error) {
        alert("Virhe poistettaessa: " + error.message);
        return false;
    }
    return true;
}

async function clearAllFeedback() {
    if (!confirm("Oletko VARMA? Kaikki palautteet poistetaan pysyvästi Supabasesta!")) return;

    // Supabase delete requires a filter, we use a filter that matches everything
    const { error } = await window.supabaseClient
        .from('feedback')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
        alert("Virhe tyhjennettäessä: " + error.message);
    } else {
        alert("Kaikki palautteet poistettu!");
        if (typeof renderFeedback === 'function') renderFeedback();
    }
}

// Global functions for UI
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.saveTitle = saveTitle;
window.saveBackgroundColor = saveBackgroundColor;
window.saveBackgroundUrl = saveBackgroundUrl;
window.resetSiteFromAdmin = resetSiteFromAdmin;
window.loadFeedback = loadFeedback;
window.markAsRead = markAsRead;
window.deleteFeedback = deleteFeedback;
window.clearAllFeedback = clearAllFeedback;
