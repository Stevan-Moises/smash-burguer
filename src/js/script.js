const menu = document.getElementById("menu")
const myCart = document.getElementById("my-cart")
const cartForm = document.getElementById("cart-form")
const cartItems = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkout = document.getElementById("checkout")
const closeForm = document.getElementById("close-form")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

//Abrir o form do carrinho
myCart.addEventListener("click", function() {
    updateCart();
    cartForm.style.display = "flex"
})

//fechar form clicando fora
cartForm.addEventListener("click", function(event) {
    if(event.target === cartForm){
        cartForm.style.display = "none"
    }
})

//fechar no botao fechar
closeForm.addEventListener("click", function(){
    cartForm.style.display = "none"
})

//cliquei no carrinho
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        //add no carrinho
        addToCart(name, price)
    }
})

//função para add no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        //se o item já existe, aumenta a quantidade +1
        existingItem.quantity += 1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCart()
}

//Atualizar o carrinho
function updateCart(){
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <div>
                <button class="remove-from-cart" data-name="${item.name}">
                    Remover
                </button>
            </div>
        </div>
        `

        total += item.price * item.quantity;

        cartItems.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

//função para remover o item do carrinho
cartItems.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCart();
            return;
        }

        cart.splice(index, 1);
        updateCart();
    }
}

//Pegar oq foi digitado no endereço
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//Finalizar pedido
checkout.addEventListener("click", function(){
    //restaurante fechado
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #ef4444, #f7c41f)",
            },
        }).showToast();
        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //enviar o pedido para api whats
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "82981744522"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCart();
})

//Verificar a hora e manipular o card do horario
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}