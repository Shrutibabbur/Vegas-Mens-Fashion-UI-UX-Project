
function order(){
window.open("https://wa.me/918378917281");
}

function addProduct(){

let name=document.getElementById("pname").value;
let price=document.getElementById("pprice").value;
let img=document.getElementById("pimg").value;

if(name==""||price==""||img==""){
alert("Fill all fields");
return;
}

let product=`
<div class="product">
<img src="${img}">
<h3>${name}</h3>
<p>₹${price}</p>
<button onclick="order()">Order on WhatsApp</button>
</div>
`;

document.getElementById("productContainer").innerHTML+=product;

}
