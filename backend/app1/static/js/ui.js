// purely cosmetic (optional)
console.log("UI loaded");

document.querySelectorAll("button").forEach(btn=>{
btn.addEventListener("click",()=>{
btn.style.transform="scale(.95)";
setTimeout(()=>btn.style.transform="scale(1)",120);
});
});

let images=[]
document.querySelectorAll(".thumb")
.forEach(i=>images.push(i.src))

let index=0

function setImage(src){
document.getElementById("slide").src=src
}

function next(){
index=(index+1)%images.length
slide.src=images[index]
}

function prev(){
index--
if(index<0) index=images.length-1
slide.src=images[index]
}

const modal=document.getElementById("productModal")

function openModal(){
modal.style.display="flex"
}

function closeModal(){
modal.style.display="none"
}

/* ================= DRAG DROP ================= */

const dropArea=document.getElementById("drop-area")
const input=document.getElementById("fileInput")
const preview=document.getElementById("preview")

dropArea.addEventListener("click",()=>{
input.click()
})

dropArea.addEventListener("dragover",(e)=>{
e.preventDefault()
dropArea.classList.add("drag")
})

dropArea.addEventListener("dragleave",()=>{
dropArea.classList.remove("drag")
})

dropArea.addEventListener("drop",(e)=>{
e.preventDefault()
dropArea.classList.remove("drag")

input.files=e.dataTransfer.files
showPreview(input.files)
})

input.addEventListener("change",()=>{
showPreview(input.files)
})

function showPreview(files){

preview.innerHTML=""

Array.from(files).forEach(file=>{

let reader=new FileReader()

reader.onload=e=>{
let img=document.createElement("img")
img.src=e.target.result
img.className="preview-img"
preview.appendChild(img)
}

reader.readAsDataURL(file)

})
}