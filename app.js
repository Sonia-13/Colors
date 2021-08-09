const inputColor = document.querySelector("#input_color")
const bttnAddColor = document.querySelector("#add_color")
const bttnAddColorMix = document.querySelector("#add_color_mix")
const bttnCopyColor = document.querySelector("#copy")
const savedColors = document.querySelector(".saved_colors")
const invisibleColorField = document.querySelector("#invisible_color_code")

let colorsInMix = []

bttnAddColor.addEventListener('click', add_new_color_from_input)
bttnAddColorMix.addEventListener('click', add_new_color_from_input_to_mix)
bttnCopyColor.addEventListener('click', copy_color)
inputColor.addEventListener('change', copy_to_invisible_field)

function add_new_color_from_input(e) {
  e.preventDefault();
  
  const colorOfCircle = inputColor.value;
  add_new_color(colorOfCircle);

  save_to_localStorage(colorOfCircle);
}

function add_new_color_from_input_to_mix(e) {
  e.preventDefault();
  
  const colorOfCircle = inputColor.value;
  colorsInMix.push(colorOfCircle)
  create_mix(colorsInMix)
}

function copy_color(e) {
  e.preventDefault();
  
  var copyText = document.getElementById("invisible_color_code");
  copyText.select();
  copyText.setSelectionRange(0, 99999)
  document.execCommand("copy");
}

function copy_to_invisible_field(e) {
  invisibleColorField.innerHTML = inputColor.value;
}

function add_new_color(color) {

  const colorWrapper = document.createElement("div");
  colorWrapper.classList.add("color_wrapper")

  colorWrapper.addEventListener("mouseenter", toggle_color_buttons)

  colorWrapper.addEventListener("mouseleave", toggle_color_buttons)

  colorWrapper.addEventListener("click", handle_click_on_color_buttons)

  const circle = document.createElement("span")
  circle.classList.add("circle");
  circle.style.backgroundColor = color;  
  const colorName = document.createElement("p");
  colorName.innerHTML = hex_to_rgb(color);
  colorName.classList.add("color_descript")
  
  const btnsWrapper = document.createElement("div");
  btnsWrapper.classList.add("bttn_wrapper")
  const plus = document.createElement("i")
  const trash = document.createElement("i")
  const minus = document.createElement("i")
  plus.classList.add("far", "fa-plus-square")
  trash.classList.add("far", "fa-trash-alt")
  minus.classList.add("far", "fa-minus-square")

  //append children
  btnsWrapper.appendChild(plus)
  btnsWrapper.appendChild(minus)
  btnsWrapper.appendChild(trash)

  colorWrapper.appendChild(circle);
  colorWrapper.appendChild(colorName);
  colorWrapper.appendChild(btnsWrapper);

  savedColors.appendChild(colorWrapper);
}

function toggle_color_buttons(e) {
  const colorBttns = e.target.childNodes[2]
  const colorDescr = e.target.childNodes[1]
  colorBttns.classList.toggle("show_block"); 
  colorDescr.classList.toggle('show_visible');
}

function handle_click_on_color_buttons(e) {
  const item = e.target
  const circle = item.parentNode.previousSibling.previousSibling

  if (item.classList[0] == "far") {
    if (item.classList[1] == "fa-plus-square") {
      // add to circle
      colorsInMix.push(circle.style.backgroundColor)
      create_mix(colorsInMix)

    } else if (item.classList[1] == "fa-minus-square"){
      colorsInMix = colorsInMix.filter((elem, index, arr) => {
        if (elem[0] === "#") {
          return hex_to_rgb(elem) !== circle.style.backgroundColor;
        }
        return elem !== circle.style.backgroundColor;

      })
      create_mix(colorsInMix)
    }
    else if (item.classList[1] == "fa-trash-alt") {
      item.parentNode.parentNode.remove();
      remove_from_localStorage(circle.style.backgroundColor);

    }
  }
}

function save_to_localStorage(color) {
  let savedColors;

  if (localStorage.getItem("savedColors") != null) 
    savedColors = JSON.parse(localStorage.getItem("savedColors"));
  else
    savedColors = [];

  savedColors.push(color);

  localStorage.setItem("savedColors", JSON.stringify(savedColors));

}

function load_from_localStorage() {
  let savedColors;

  if (localStorage.getItem("savedColors") != null) 
    savedColors = JSON.parse(localStorage.getItem("savedColors"));
  else
    savedColors = [];

  for (let color of savedColors) {
    add_new_color(color);
  }
}

function remove_from_localStorage(colorToRemove) {
  let colors;
  if (localStorage.getItem("savedColors") !== null) {
    colors = JSON.parse(localStorage.getItem("savedColors"))
    for(let i=0; i<colors.length; i++) {
      if (hex_to_rgb(colors[i]) === colorToRemove) {
        colors.splice(i, 1)
        break;
      }
    }
  }
  localStorage.setItem('savedColors', JSON.stringify(colors))
}

function create_mix(colors) {
  const slices = colors.length

  if (slices == 0) {
    clear_mix()

  } else if (slices == 1) {
    create_circle_mix(150, 150, 150, colors[0]);

  } else {
    create_pie(150, 150, 150, colors);
  }
}


// code from https://codepen.io/hari_shanx/pen/NRyPBz
function create_pie(cx, cy, r, colors) {
  var fromAngle, toAngle, 
  fromCoordX, fromCoordY, 
  toCoordX, toCoordY, 
  path, d;
  
  const slices = colors.length
  for (var i = 0; i < slices; i++) {
    path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    fromAngle = i * 360 / slices;
    toAngle = (i + 1) * 360 / slices;
    //console.log(fromAngle + ' ' + toAngle);
    fromCoordX = cx + (r * Math.cos(fromAngle * Math.PI / 180));
    fromCoordY = cy + (r * Math.sin(fromAngle * Math.PI / 180));
    toCoordX = cx + (r * Math.cos(toAngle * Math.PI / 180));
    toCoordY = cy + (r * Math.sin(toAngle * Math.PI / 180));
    //console.log(fromCoord + ' ' + toCoord);
    d = 'M' + cx + ',' + cy + ' L' + fromCoordX + ',' + fromCoordY + ' A' + r + ',' + r + ' 0 0,1 ' + toCoordX + ',' + toCoordY + 'z';
    //console.log(d);
    path.setAttributeNS(null, "d", d);
    path.setAttributeNS(null, "fill", colors[i]);
    path.setAttributeNS(null, "stroke", "#1e1e1e");
    path.classList.add("circle_mix")
    document.getElementById('mix').appendChild(path);
  }
}

function create_circle(cx, cy, r, color) {
  const svgns = "http://www.w3.org/2000/svg";
  const circle = document.createElementNS(svgns, 'circle');
  circle.setAttributeNS(null, 'cx', cx);
  circle.setAttributeNS(null, 'cy', cy);
  circle.setAttributeNS(null, 'r', r);
  circle.setAttributeNS(null, 'style', 'fill: '+color+'; stroke: #1e1e1e; stroke-width: 1px;' );
  return circle
}

function create_circle_mix(cx, cy, r , color) {
  const circle = create_circle(cx, cy, r, color)
  circle.classList.add("circle_mix_one_color")
  document.getElementById('mix').appendChild(circle);
}

function clear_mix() {
  const mix = document.getElementById('mix')
  while (mix.firstChild)
    mix.removeChild(mix.lastChild)
}

function hex_to_rgb(hex) {
  let abc = [hex.substring(1,3), hex.substring(3, 5), hex.substring(5, 7)]
  for (let i=0; i<3; i++) {
    abc[i] = parseInt(abc[i], 16)
    abc[i] = abc[i].toString()
  }
  rgb = 'rgb('+abc.join(", ")+')'
  return rgb;
}

window.onload = () => {
  load_from_localStorage();
}

