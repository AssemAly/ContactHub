var contactObject = {
  id: 0,
  fullName: "",
  phoneNumber: "",
  emailAddress: "",
  address: "",
  notes: "",
  favorite: false,
  emergency: false,
  group: "",
};

var contactCardsContainer = document.getElementById("contact-cards-container");
var favoriteContactsList = document.getElementById("favorite-contacts-list");
var emergencyContactsList = document.getElementById("emergency-contacts-list");
var phoneInput = document.getElementById("phone-number");
var fullNameInput = document.getElementById("full-name");
var emailInput = document.getElementById("email-address");
var addressInput = document.getElementById("address");
var notesInput = document.getElementById("notes");
var favoriteInput = document.getElementById("favorite");
var emergencyInput = document.getElementById("emergency");
var groupInput = document.getElementById("group");
var totalContactsCount = document.getElementById("total-contacts-count");
var favoritesCount = document.getElementById("favorites-count");
var emergencyCount = document.getElementById("emergency-count");

var form = document.querySelector("form");
var saveForm = document.getElementById("saveForm");

var contacts = JSON.parse(localStorage.getItem("contacts")) ?? [];
var contactId = 0;
var totalFavorites = 0;
var totalEmergency = 0;
initialize();

function getContactAbbreviation(fullName) {
  var names = fullName.split(" ");
  var abbreviation = names[0].charAt(0).toUpperCase();
  if (names.length > 1) {
    abbreviation += names[names.length - 1].charAt(0).toUpperCase();
  }
  return abbreviation;
}
function addContactCard(contact) {
  if (contact.id <= 0) return "";

  var abbreviation = getContactAbbreviation(contact.fullName);
  var displayEmergencyBadge = contact.emergency ? "" : "d-none";
  var displayFavoriteBadge = contact.favorite ? "" : "d-none";
  var contactCard = `
     <div class="col-md-6 col-sm-12">
                <div class="card contact-card shadow-sm border-0">
                  <div class="card-body p-4">
                    <div class="d-flex align-items-start mb-3">
                      <div class="position-relative me-3">
                        <div class="star-badge ${displayFavoriteBadge}">
                          <i class="fa-solid fa-star"></i>
                        </div>
                        <div class="avatar">${abbreviation}</div>
                        <div class="favorite-badge ${displayEmergencyBadge}">
                          <i class="fa-solid fa-heart-pulse"></i>
                        </div>
                      </div>
                      <div>
                        <h3 class="contact-name mb-0">${contact.fullName}</h3>
                        <div class="d-flex align-items-center gap-3">
                          <div class="info-icon phone">
                            <i class="fa-solid fa-phone"></i>
                          </div>
                          <span class="info-text">${contact.phoneNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div class="d-flex flex-column gap-3 mb-3">
                      <div class="d-flex align-items-center gap-3">
                        <div class="info-icon email">
                          <i class="fa-solid fa-envelope"></i>
                        </div>
                        <span class="info-text">${contact.emailAddress}</span>
                      </div>

                      <div class="d-flex align-items-center gap-3">
                        <div class="info-icon location">
                          <i class="fa-solid fa-location-dot"></i>
                        </div>
                        <span class="info-text">${contact.address}</span>
                      </div>
                    </div>

                   
                    <div class="d-flex gap-2 mb-3">
                      <span class="badge tag family">${contact.group}</span>
                      <span
                        class="badge tag emergency d-flex align-items-center gap-1 ${displayEmergencyBadge}"
                      >
                        <i class="fa-solid fa-heart-pulse"></i>
                        Emergency
                      </span>
                    </div>

                   
                    <div class="d-flex justify-content-between pt-3 border-top">
                      <div class="d-flex gap-2">
                 
                        <a href="tel:${contact.phoneNumber}" class="btn action-btn call">
                          <i class="fa-solid fa-phone"></i>
                        </a>
                        <a href="mailto:${contact.emailAddress}" class="btn action-btn email">
                          <i class="fa-solid fa-envelope"></i>
                        </a>
                      </div>
                      <div class="d-flex gap-2">
                        <button class="btn action-btn star" onclick="toggleFavorite('${contact.phoneNumber}')">
                          <i class="fa-regular fa-star"></i>
                        </button>
                        <button class="btn action-btn heart" onclick="toggleEmergency('${contact.phoneNumber}')">
                          <i class="fa-solid fa-heart-pulse"></i>
                        </button>
                        <button class="btn action-btn edit" onclick="editContact('${contact.phoneNumber}')">
                          <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn action-btn delete" onclick="deleteContact('${contact.phoneNumber}')">
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  `;
  contactCardsContainer.innerHTML += contactCard;
}

function toggleFavorite(phoneNumber) {
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].phoneNumber === phoneNumber) {  
      contacts[i].favorite = !contacts[i].favorite;
      totalFavorites = contacts[i].favorite ? totalFavorites + 1 : totalFavorites - 1;
      break;
    }
  }
  localStorage.setItem("contacts", JSON.stringify(contacts));

  renderContacts();
  updateContactCounts();
}
function toggleEmergency(phoneNumber) {
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].phoneNumber === phoneNumber) {
      contacts[i].emergency = !contacts[i].emergency;
      totalEmergency = contacts[i].emergency ? totalEmergency + 1 : totalEmergency - 1;
      break;
    } 
  }
  localStorage.setItem("contacts", JSON.stringify(contacts));
  renderContacts();
  updateContactCounts();
}

function addFavoriteContact(contact) {
  if (contact.favorite) {  
    var abbreviation = getContactAbbreviation(contact.fullName);

    var element = `          
    <div class="contact-item">
                  <div class="contact-left">
                    <div class="contact-avatar blue">${abbreviation}</div>
                    <div class="contact-info">
                      <h6>${contact.fullName}</h6>
                      <p>${contact.phoneNumber}</p>
                    </div>
                  </div>
                  <button class="call-btn green-light">
                    <i class="fa-solid fa-phone"></i>
                  </button>
                </div>`;
  }
  favoriteContactsList.innerHTML += element;
}

function addEmergencyContact(contact) {
  if (contact.emergency) {    
    var abbreviation = getContactAbbreviation(contact.fullName);
    var element = ` <div class="contact-item">
                  <div class="contact-left">
                    <div class="contact-avatar blue">${abbreviation}</div>
                    <div class="contact-info">
                      <h6>${contact.fullName}</h6>
                      <p>${contact.phoneNumber}</p>
                    </div>
                  </div>
                  <button class="call-btn pink">
                    <i class="fa-solid fa-phone"></i>
                  </button>
                </div>`;
  }
  emergencyContactsList.innerHTML += element;
}

function validatePhone(phone) {
  var regex = /^(?:\+20|0)?1[0125]\d{8}$/;
  return regex.test(phone);
}

function checkPhoneExistence(phone) {
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].phoneNumber === phone) {
      return true;
    }
  }
  return false;
}

function validateContactForm() {
  var fullName = fullNameInput.value.trim();
  var phoneNumber = phoneInput.value;
  if (fullName === "" || phoneNumber === "") {
    Swal.fire({
      icon: "error",
      title: "required fields missing...",
      text: "Please fill in all required fields.",
    });
    return false;
  }
  if (!validatePhone(phoneNumber)) {
    Swal.fire({
      icon: "error",
      title: "Invalid phone number",
      text: "Please enter a valid phone number.",
    });
    return false;
  }
  if (checkPhoneExistence(phoneNumber)) {
    Swal.fire({
      icon: "error",
      title: "Phone number already exists",
      text: "Please enter a different phone number.",
    });
    return false;
  }
  if (!validateEmail(emailInput.value.trim())) {
    Swal.fire({
      icon: "error",
      title: "Invalid email address",
      text: "Please enter a valid email address.",
    });
    return false;
  }
  return true;
}

phoneInput.addEventListener("input", function () {
  const phone = this.value;

  if (validatePhone(phone)) {
    this.classList.remove("is-invalid");
    this.classList.add("is-valid");
  } else {
    this.classList.remove("is-valid");
    this.classList.add("is-invalid");
  }
});

function renderContacts() {
  contactCardsContainer.innerHTML = "";
  favoriteContactsList.innerHTML = "";
  emergencyContactsList.innerHTML = "";
  for (var i = 0; i < contacts.length; i++) {
    addContactCard(contacts[i]);
    if (contacts[i].favorite) {
      addFavoriteContact(contacts[i]);
    }
    if (contacts[i].emergency) {
      addEmergencyContact(contacts[i]);
    }
  }
}

function updateContactCounts() {
  var totalContacts = contacts.length;
  totalContactsCount.textContent = totalContacts;
  favoritesCount.textContent = totalFavorites;
  emergencyCount.textContent = totalEmergency;
}

saveForm.addEventListener("click", function () {
  if (validateContactForm() === false) {
  
    return;
  }

  contactId += 1;
  contactObject.id = contactId;
  contactObject.fullName = fullNameInput.value.trim();
  contactObject.phoneNumber = phoneInput.value.trim();
  contactObject.emailAddress = emailInput.value.trim();
  contactObject.address = addressInput.value.trim();
  contactObject.notes = notesInput.value.trim();
  contactObject.favorite = favoriteInput.checked;
  contactObject.emergency = emergencyInput.checked;
  contactObject.group = groupInput.value;
  totalEmergency = contactObject.emergency ? totalEmergency + 1 : totalEmergency;
  totalFavorites = contactObject.favorite ? totalFavorites + 1 : totalFavorites;
  contacts.push(contactObject);
  renderContacts();
  clearForm();
  contactObject = {};
  localStorage.setItem("contacts", JSON.stringify(contacts));
  if (contactObject.favorite) {
    addFavoriteContact(contactObject);
  }
  if (contactObject.emergency) {
    addEmergencyContact(contactObject);
  }
  updateContactCounts();

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("contactModal")
  );
  modal.hide();

  Swal.fire({
    icon: "success",
    title: "Contact Added!",
    text: "Contact has been saved successfully.",
    timer: 2000,
    showConfirmButton: false,
  });
});

function clearForm() {
  form.reset();
  phoneInput.classList.remove("is-valid", "is-invalid");
}

function initialize() {
  if (contacts.length > 0) {
    contactId = contacts[contacts.length - 1].id;
    for (var i = 0; i < contacts.length; i++) {
      totalFavorites += contacts[i].favorite ? 1 : 0;
      totalEmergency += contacts[i].emergency ? 1 : 0;
    }
    renderContacts();
    updateContactCounts();
  }
}

function deleteContact(phoneNumber) {
  Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    contacts = contacts.filter(function (contact) {
    return contact.phoneNumber !== phoneNumber;
  });

  renderContacts();
  updateContactCounts();
  localStorage.setItem("contacts", JSON.stringify(contacts));
    Swal.fire({
      title: "Deleted!",
      text: "Contact has been deleted.",
      icon: "success"
    });
  }
});
  
}

function editContact(phoneNumber) {
  var contact = contacts.find(function (c) {
    return c.phoneNumber === phoneNumber;
  });
  if (contact) {
    fullNameInput.value = contact.fullName;
    phoneInput.value = contact.phoneNumber;
    emailInput.value = contact.emailAddress;
    addressInput.value = contact.address;
    notesInput.value = contact.notes;
    favoriteInput.checked = contact.favorite;
    emergencyInput.checked = contact.emergency;
    groupInput.value = contact.group;
  }
  var modal = new bootstrap.Modal(document.getElementById("contactModal"));
  modal.show();
}

function searchContacts() {
  var query = document.getElementById("searchBar").value.toLowerCase();
  var filteredContacts = contacts.filter(function (contact) {
    return (
      contact.fullName.toLowerCase().includes(query) ||
      contact.phoneNumber.includes(query) ||
      contact.emailAddress.toLowerCase().includes(query)
    );
  });

  contactCardsContainer.innerHTML = "";
  for (var i = 0; i < filteredContacts.length; i++) {
    addContactCard(filteredContacts[i]);
  }
}

function validateEmail(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}