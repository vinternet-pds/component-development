// Function to enhance client side form validation
UK_Parliament.formValidation = function () {

  if (document.querySelector('input[required]:not([type="search"])')) {

    // Grab all required input omitting the global search input
    var requiredFields = document.querySelectorAll('[required]:not([type="search"])');

    checkUserInput = function (e) {

      var
        elemValidity = this.validity,
        elemParent = this.parentElement,
        elemTarget,
        elemTargetInline;

      console.log(elemParent);

      if (elemParent.classList.contains('input-group') || elemParent.classList.contains('input-group__inline') || elemParent.classList.contains('input-group__verbose')) {
        elemTarget = elemParent.previousElementSibling;
        elemTargetInline = true;
      } else {
        elemTarget = this.previousElementSibling;
      }

      // If invalid or change event listener is fired run validity check
      if (elemValidity.valueMissing === true || elemValidity.patternMismatch === true) {

        // Construct inline error message
        var
          elemIdError = (this.getAttribute('id') + 'Error'),
          errorText = this.getAttribute('data-error'),
          errorMessage = document.createElement('p');

        // Set aria attritbute on invalid input field
        this.setAttribute('aria-invalid', 'true');
        this.setAttribute('aria-describedby', elemIdError);

        errorMessage.innerHTML = errorText;
        errorMessage.classList.add('message--error');
        errorMessage.setAttribute('id', elemIdError);
        errorMessage.setAttribute('aria-live', 'polite');

        // Add error message and custom validity if it doesn't already exist
        if (!elemTarget || !elemTarget.classList.contains('message--error')) {

          // Check if target element is within input group wrapper
          if (elemTargetInline === true) {
            elemParent.insertAdjacentElement('beforebegin', errorMessage);
          } else {
            elemParent.insertBefore(errorMessage, this);
          }

          this.setCustomValidity(errorText);
        } else {
          return false;
        }
      }

      // If change event listener is fired and input passes validity checks
      else {

        // Reset custom validity message
        this.setCustomValidity('');

        // Check for aria attributes, remove them and associated inline error message
        if (this.hasAttribute('aria-invalid')) {
          this.removeAttribute('aria-invalid');
          this.removeAttribute('aria-describedby');
          elemTarget.remove();
        }
      }
    };

    // Add event listeners on all required input fields
    for (var x = 0; x < requiredFields.length; x++) {
      requiredFields[x].addEventListener('invalid', checkUserInput, false);
      requiredFields[x].addEventListener('change', checkUserInput, false);
    }
  }
};

UK_Parliament.formValidation();
