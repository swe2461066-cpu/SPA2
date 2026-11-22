// Bulma notification ашиглан мэдээлэл/анхааруулга харуулна. type: info, success, warning, danger
export function renderNotification(message, type = "info") {
  return `<div class="notification is-light is-${type}">${message}</div>`;
}
