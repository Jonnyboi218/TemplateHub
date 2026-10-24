const products = [
  {id:1,name:"The Weekly Reset Planner",category:"Planning",price:8,description:"A calm, practical weekly planner to organize priorities, routines, and the little tasks that add up.",art:"planner",badge:"BESTSELLER",accent:"#a9bc8c"},
  {id:2,name:"Small Business Starter Kit",category:"Business",price:14,description:"A tidy set of worksheets for mapping an idea, tracking expenses, and planning your next steps.",art:"business",badge:"POPULAR",accent:"#c39a76"},
  {id:3,name:"Studio Notes Workbook",category:"Design",price:11,description:"A thoughtful workbook for collecting ideas, shaping concepts, and keeping creative projects moving.",art:"design",badge:"EDITOR'S PICK",accent:"#a99ac4"},
  {id:4,name:"Study Session Planner",category:"Study",price:5,description:"Break big assignments into manageable study sessions with space for goals and review notes.",art:"study",badge:"",accent:"#8eb5b9"},
  {id:5,name:"Simple Budget Dashboard",category:"Planning",price:9,description:"A friendly monthly budget layout for keeping an eye on spending, savings, and upcoming costs.",art:"budget",badge:"",accent:"#c4ad58"},
  {id:6,name:"Social Content Calendar",category:"Business",price:12,description:"Plan post ideas, keep a consistent schedule, and make content planning feel less overwhelming.",art:"social",badge:"NEW",accent:"#8da47b"},
  {id:7,name:"Project Kickoff Board",category:"Design",price:7,description:"Clarify the goal, audience, milestones, and next actions before a new project gets underway.",art:"project",badge:"",accent:"#bd8e82"},
  {id:8,name:"Minimal Notes Pack",category:"Study",price:4,description:"Clean, flexible note pages for classes, reading notes, and everyday idea capture.",art:"minimal",badge:"",accent:"#a7a89d"}
];

let activeCategory = "All";
let cart = [];
let selectedProduct = null;
let toastTimer;
const $ = (id) => document.getElementById(id);
const grid = $("productGrid");
const money = (n) => "$" + Number(n).toFixed(2);

function artMarkup(product, small=false) {
  const accent = product.accent || "#a9bc8c";
  return `<div class="product-art art-${product.art}" style="--preview-accent:${accent}">
    ${product.badge && !small ? `<span class="product-badge">${product.badge}</span>` : ""}
    <div class="paper-preview"><div class="preview-heading">${product.name.replace(" ", "<br>")}</div><div class="preview-sub">${product.category.toUpperCase()} · TEMPLATE</div><div class="preview-lines"><i></i><i></i><i></i></div><div class="preview-blocks"><i></i><i></i><i></i><i></i></div><div class="preview-shape"></div></div>
    ${!small ? `<button class="quick-add" data-quick-add="${product.id}" aria-label="Add ${product.name} to bag">+</button>` : ""}
  </div>`;
}
function getFilteredProducts() {
  const term = $("searchInput").value.trim().toLowerCase();
  let list = products.filter(p => (activeCategory === "All" || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)));
  const sort = $("sortSelect").value;
  if (sort === "low") list.sort((a,b)=>a.price-b.price);
  if (sort === "high") list.sort((a,b)=>b.price-a.price);
  return list;
}
function renderProducts() {
  const list = getFilteredProducts();
  grid.innerHTML = list.map(p => `<article class="product-card" tabindex="0" role="button" aria-label="View ${p.name}" data-product="${p.id}">
    ${artMarkup(p)}
    <div class="product-meta"><div><div class="product-name">${p.name}</div><div class="product-category">${p.category} · Digital template</div></div><div class="product-price">${money(p.price)}</div></div>
  </article>`).join("");
  $("emptyState").classList.toggle("hidden", list.length > 0);
}
function showToast(message) {
  const toast = $("toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>toast.classList.remove("show"), 2600);
}
function openProduct(id) {
  selectedProduct = products.find(p=>p.id === Number(id));
  if (!selectedProduct) return;
  $("modalArt").innerHTML = artMarkup(selectedProduct, true);
  $("modalCategory").textContent = selectedProduct.category.toUpperCase() + " TEMPLATE";
  $("modalTitle").textContent = selectedProduct.name;
  $("modalDescription").textContent = selectedProduct.description;
  $("modalPrice").textContent = money(selectedProduct.price);
  $("productModalBackdrop").classList.remove("hidden");
}
function closeModal(backdrop) { backdrop.classList.add("hidden"); }
function addToCart(id) {
  const p = products.find(x=>x.id===Number(id)); if (!p) return;
  cart.push(p); renderCart(); showToast(`${p.name} added to your bag.`);
}
function renderCart() {
  $("cartCount").textContent = cart.length;
  $("drawerCount").textContent = `(${cart.length})`;
  $("cartTotal").textContent = money(cart.reduce((sum,p)=>sum+p.price,0));
  $("cartItems").innerHTML = cart.length ? cart.map((p,i)=>`<div class="cart-row"><div class="cart-thumb">${artMarkup(p,true)}</div><div><h3>${p.name}</h3><p>${p.category} template</p><button class="remove-item" data-remove="${i}">Remove</button></div><strong>${money(p.price)}</strong></div>`).join("") : `<div class="cart-empty">Your bag is empty for now.<br>Find something useful to get started.</div>`;
}
function openCart(){ $("cartBackdrop").classList.remove("hidden"); }
function openSeller(){ $("sellerModalBackdrop").classList.remove("hidden"); }
function closeAll(){ document.querySelectorAll(".modal-backdrop,.drawer-backdrop").forEach(el=>el.classList.add("hidden")); }

$("categoryPills").addEventListener("click", e=>{
  const button=e.target.closest("[data-category]"); if(!button)return;
  activeCategory=button.dataset.category;
  document.querySelectorAll(".pill").forEach(p=>p.classList.toggle("active",p===button));
  renderProducts();
});
$("searchInput").addEventListener("input",renderProducts);
$("sortSelect").addEventListener("change",renderProducts);
$("resetFilters").addEventListener("click",()=>{$("searchInput").value="";activeCategory="All";$("sortSelect").value="featured";document.querySelectorAll(".pill").forEach(p=>p.classList.toggle("active",p.dataset.category==="All"));renderProducts();});
$("showAll").addEventListener("click",()=>{ $("searchInput").value="";activeCategory="All";$("sortSelect").value="featured";document.querySelectorAll(".pill").forEach(p=>p.classList.toggle("active",p.dataset.category==="All"));renderProducts();showToast("Showing all templates.");});
grid.addEventListener("click",e=>{const quick=e.target.closest("[data-quick-add]");if(quick){e.stopPropagation();addToCart(quick.dataset.quickAdd);return;}const card=e.target.closest("[data-product]");if(card)openProduct(card.dataset.product);});
grid.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-product]")){e.preventDefault();openProduct(e.target.dataset.product);}});
$("modalAdd").addEventListener("click",()=>{if(selectedProduct)addToCart(selectedProduct.id);closeModal($("productModalBackdrop"));});
$("cartOpen").addEventListener("click",openCart);$("cartClose").addEventListener("click",()=>closeModal($("cartBackdrop")));
$("cartItems").addEventListener("click",e=>{const btn=e.target.closest("[data-remove]");if(!btn)return;cart.splice(Number(btn.dataset.remove),1);renderCart();});
$("checkoutButton").addEventListener("click",()=>showToast(cart.length?"Demo only — checkout and payments aren't connected.":"Your bag is empty."));
$("sellOpen").addEventListener("click",openSeller);$("sellOpen2").addEventListener("click",openSeller);
document.querySelectorAll("[data-close]").forEach(btn=>btn.addEventListener("click",()=>closeModal(btn.closest(".modal-backdrop"))));
document.querySelectorAll(".modal-backdrop,.drawer-backdrop").forEach(backdrop=>backdrop.addEventListener("click",e=>{if(e.target===backdrop)closeModal(backdrop);}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAll();});
$("sellerForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("sellerName").value.trim(), category=$("sellerCategory").value, price=Number($("sellerPrice").value), description=$("sellerDescription").value.trim();
  if(!name||!category||!description||!Number.isFinite(price)||price<0){showToast("Please complete every field.");return;}
  const artByCategory={Planning:"planner",Business:"business",Design:"design",Study:"study"};
  const newProduct={id:Date.now(),name,category,price,description,art:artByCategory[category]||"minimal",badge:"COMMUNITY",accent:"#a9bc8c"};
  products.unshift(newProduct);$("sellerForm").reset();closeModal($("sellerModalBackdrop"));activeCategory="All";$("searchInput").value="";
  document.querySelectorAll(".pill").forEach(p=>p.classList.toggle("active",p.dataset.category==="All"));renderProducts();showToast("Demo listing added to this page.");
  $("marketplace").scrollIntoView({behavior:"smooth"});
});
$("newsletterForm").addEventListener("submit",e=>{e.preventDefault();if(!$("emailInput").checkValidity())return;showToast("Thanks! This demo doesn't send or store emails.");$("emailInput").value="";});
renderProducts();renderCart();
