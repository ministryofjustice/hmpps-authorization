//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//
function showDiv(divId, element, val) {
  document.getElementById(divId).style.display = element.value === val ? 'block' : 'none'
}

document.addEventListener('DOMContentLoaded', function (event) {
  const select = document.getElementById('access-token-validity')
  if (!select) return
  select.onchange = () => showDiv('custom-access-token-validity-element', select, 'custom')
  showDiv('custom-access-token-validity-element', select, 'custom')
})
