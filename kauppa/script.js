let wishlist = [];

document.querySelectorAll('.product-card button').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.product-card');
        const product = {
            name: card.querySelector('h3').textContent,
            price: card.querySelector('p').textContent,
            image: card.querySelector('img').src
        };
        
        addToWishlist(product);
    });
});

function addToWishlist(product) {
    wishlist.push(product);
    updateWishlistCount();
    alert('Tuote lisätty toivelistaan!');
}

function updateWishlistCount() {
    document.getElementById('wishlist-count').textContent = wishlist.length;
}

const modal = document.getElementById('wishlist-modal');
const wishlistToggle = document.getElementById('wishlist-toggle');
const closeBtn = document.querySelector('.close');

wishlistToggle.onclick = function(e) {
    e.preventDefault();
    updateWishlistDisplay();
    modal.style.display = 'block';
}

closeBtn.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

function updateWishlistDisplay() {
    const container = document.getElementById('wishlist-items');
    container.innerHTML = '';
    let total = 0;

    wishlist.forEach((item, index) => {
        const price = parseFloat(item.price.replace('€', '').trim());
        total += price;

        const itemElement = document.createElement('div');
        itemElement.className = 'wishlist-item';
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span>${item.price}</span>
            <button onclick="removeFromWishlist(${index})">Poista</button>
        `;
        container.appendChild(itemElement);
    });

    document.getElementById('wishlist-total').textContent = `Yhteensä: ${total.toFixed(2)} €`;
}


function removeFromWishlist(index) {
    wishlist.splice(index, 1);
    updateWishlistCount();
    updateWishlistDisplay();
}
