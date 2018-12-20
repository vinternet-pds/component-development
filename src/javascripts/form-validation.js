// Parent function to scope enhanced client side form validation
UK_Parliament.formValidation = function () {

  if (document.querySelector('[required]')) {

    // Main function to check input validity and handle correct state
    inputValidationCheck = function (elm) {
      var element = this;
      var elementParent = this.parentElement;
      var elementValidity = this.validity;
      var elementType = this.getAttribute('type');
      var elementTarget;
      var errorBlock;

      // Funtion to identify and capture correct DOM location for inserting error message
      inputErrorPosition = function (elm, elp) {
        if (elementParent.className.match(/input-group/)) {
          elementTarget = elementParent.previousElementSibling;
        } else {
          elementTarget = element.previousElementSibling;
        }

        return elementTarget;
      };

      inputErrorPosition(element, elementParent);

      // Function to add error message and custom validity if it doesn't already exist
      var inputErrorApplication = function (elm) {
        if (!elementTarget || !elementTarget.classList.contains('message--error')) {
          elementTarget.insertAdjacentElement('afterend', errorBlock);
        } else {
          return;
        }
      };

      //console.log(elementTarget);

      // Function to check input validity and handle associated feedback
      inputErrorManagement = function (elm, elt) {

        //console.log(elementType);

        // If event listener is fired input validity check fails
        if (elementValidity.valueMissing === true || elementValidity.patternMismatch === true) {

          var elementReference = (element.getAttribute('name'));
          var errorText = element.getAttribute('data-error');

          // Set ARIA attritbutes on invalid input
          element.setAttribute('aria-invalid', 'true');
          element.setAttribute('aria-describedby', elementReference);

          // Set custom validity message on invalid input
          element.setCustomValidity(errorText);

          if (element.hasAttribute('data-error')) {
            // Construct inline error message
            errorBlock = document.createElement('p');
            errorBlock.innerHTML = errorText;
            errorBlock.classList.add('message--error');
            errorBlock.setAttribute('id', elementReference);
            errorBlock.setAttribute('aria-live', 'polite');

            inputErrorApplication(errorBlock);
          }



        } else if (elementType == 'radio' && element.hasAttribute('aria-invalid')) {
          console.log(elementType);

          // Grab name of radio group and then collection of same name
          var ic = element.getAttribute('name');
          console.log('ic = ' + ic);
          var ica = document.getElementsByName(ic);
          console.log(ica);


        // If event listener is fired input validity check passes
        } else if (element.hasAttribute('aria-invalid')) {
          // Reset custom validity message
          element.setCustomValidity('');

          // Remove ARIA attributes from invalid input
          element.removeAttribute('aria-invalid');
          element.removeAttribute('aria-describedby');

          // Remove inline error message
          elementTarget.remove();

        } else {
          return;
        }
      };

      inputErrorManagement(element, elementType);

    };

    // Function to identify, collect and manage event listeners on required inputs
    inputCollection = function () {
      // Grab all required inputs and covert to array
      var inputNodes = document.querySelectorAll('[required]');
      var inputsArray = Array.from(inputNodes);

      // Filter array removing search and postcode inputs
      var inputsRequired = inputsArray.filter(function (input) {
        return input.type !== 'search' && input.name !== 'postcode';
      });

      // Add event listeners on all remaining required inputs
      for (var x = 0; x < inputsRequired.length; x++) {
        inputsRequired[x].addEventListener('invalid', inputValidationCheck, false);
        inputsRequired[x].addEventListener('change', inputValidationCheck, false);
      }
    };

    inputCollection();
  }
};

UK_Parliament.formValidation();
